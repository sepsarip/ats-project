import os
import re
import time
import json
import logging
from typing import Dict

from sentence_transformers import SentenceTransformer
import spacy
from spacy.pipeline import EntityRuler
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

# Load models as module-level singletons for performance
_spacy_nlp = None
_sbert_model = None
_synonym_dict = {}
_ruler_initialized = False

def _load_models():
    global _spacy_nlp, _sbert_model, _synonym_dict
    if _spacy_nlp is None:
        # load fixed SpaCy model
        _spacy_nlp = spacy.load('en_core_web_sm')
        logger.info('Loaded SpaCy model en_core_web_sm')
    if _sbert_model is None:
        # load SBERT model
        model_path = os.environ.get('SBERT_MODEL_PATH', 'sentence-transformers/all-MiniLM-L6-v2')
        logger.info('Loading SBERT model from %s', model_path)
        _sbert_model = SentenceTransformer(model_path, local_files_only=True)

    # load fixed synonym dict from app/utils
    syn_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'utils', 'synonyms_ict.json'))
    if os.path.exists(syn_path):
        try:
            with open(syn_path, 'r', encoding='utf-8') as fh:
                _synonym_dict = json.load(fh)
            logger.info('Loaded synonym dict from %s with %d entries', syn_path, len(_synonym_dict))
        except Exception:
            logger.warning('Failed to load synonym dict from %s, continuing without it', syn_path)
    else:
        logger.info('No synonym dict found at %s; proceeding without synonyms', syn_path)

    # initialize EntityRuler from synonym dict for SKILL recognition
    global _ruler_initialized
    if not _ruler_initialized and _spacy_nlp is not None and _synonym_dict:
        try:
            ruler = _spacy_nlp.add_pipe(
                'entity_ruler',
                before='ner',
                config={
                    'overwrite_ents': False,
                    'phrase_matcher_attr': 'LOWER'
                    }
                )
            patterns = []
            
            # convert synonym dict to patterns for EntityRuler. Each canonical and its variants become patterns for SKILL label
            for canonical, variants in _synonym_dict.items():
                def make_pattern(text):
                    tokens = text.strip().split()
                    if len(tokens) == 1:
                        return {"label": "SKILL", "pattern": text.lower()}
                    else:
                        return {"label": "SKILL", "pattern": [{"LOWER": t} for t in tokens]}
                
                # add canonical as a pattern
                patterns.append(make_pattern(canonical))
                # add variants if list
                if isinstance(variants, list):
                    for v in variants:
                        patterns.append(make_pattern(v))
                elif isinstance(variants, str):
                    patterns.append(make_pattern(variants))

            if patterns:
                # sort patterns by length to ensure longer multi-word skills are matched before shorter ones
                patterns.sort(key=lambda p: (
                    len(p['pattern']) if isinstance(p['pattern'], list) else len(p['pattern'])
                ), reverse=True)

                # add patterns to ruler
                ruler.add_patterns(patterns)
                logger.info('Added %d patterns to EntityRuler for SKILL recognition', len(patterns))

            _ruler_initialized = True
            logger.info('Initialized EntityRuler with %d patterns for SKILL recognition', len(patterns))
        except Exception as e:
            logger.warning('Failed to initialize EntityRuler for SKILLs : %s', str(e))


def _preprocess(text: str, synonyms: Dict[str, str]) -> str:
    if not text:
        return ''
    t = text.lower()
    tech_normalized = {
        'c++': 'cpp',
        'c#': 'csharp',
        'node.js': 'nodejs',
        'react.js': 'react',
        'express.js': 'express',
        'angular.js': 'angular',
        'vue.js': 'vue',
        '.net': 'dotnet',
    }
    for original, normalized in tech_normalized.items():
        t = re.sub(rf'(?<!\w){re.escape(original)}(?!\w)', ' ' + normalized + ' ', t)

    # remove urls
    t = re.sub(r'https?://\S+|www\.\S+', ' ', t)
    # remove non-alphanumeric (except spaces)
    t = re.sub(r'[^a-z0-9\s]', ' ', t)
    # collapse spaces
    t = re.sub(r'\s+', ' ', t).strip()
    # synonym expansion: variants to canonical form. For simplicity.
    if synonyms:
        for cannonical, variants in synonyms.items():
            cannonical_clean = ' '.join(cannonical.split())
            variants_list = variants if isinstance(variants, list) else [variants]
            for variant in variants_list:
                if variant.lower()== cannonical.lower():
                    continue
                t = re.sub(rf'\b{re.escape(variant.lower())}\b', ' ' + cannonical_clean + ' ', t)
        t = re.sub(r'\s+', ' ', t).strip()
    return t


def _extract_domain_tokens(text: str):
    if not _spacy_nlp:
        return []
    doc = _spacy_nlp(text)
    tokens = []

    # collect entity ruler / NER matches for SKILL
    for ent in doc.ents:
        if ent.label_ == 'SKILL':
            tokens.append(ent.text)
    # experience pattern
    for m in re.finditer(r"(\d+)\s+(years?|yrs?)", text, flags=re.I):
        tokens.append(m.group(0))

    # deduplicate and normalize tokens
    seen = set()
    out = []
    for t in tokens:
        s = t.strip().lower()
        if s and s not in seen:
            seen.add(s)
            out.append(s)
    return out

def score(payload: dict) -> dict:
    start = time.time()
    try:
        _load_models()
        app_id = payload.get('application_id')
        cv_text = payload.get('extracted_text_cv', '')
        job_info = payload.get('job_info', {})
        requirements = job_info.get('requirements', []) or []
        descriptions = job_info.get('descriptions', []) or []

        # build job text
        job_text = ' '.join([str(x) for x in requirements + descriptions])

        # preprocess
        cv_processed = _preprocess(cv_text, _synonym_dict)
        job_processed = _preprocess(job_text, _synonym_dict)

        # NER enhancement: extract domain tokens and append
        try:
            cv_tokens = _extract_domain_tokens(cv_text)
            job_tokens = _extract_domain_tokens(job_text)
            logger.info('Extracted CV tokens: %s', cv_tokens)
            logger.info('Extracted Job tokens: %s', job_tokens)
            if cv_tokens:
                cv_processed = cv_processed + ' ' + ' '.join(cv_tokens)
            if job_tokens:
                job_processed = job_processed + ' ' + ' '.join(job_tokens)
        except Exception:
            logger.warning('NER enhancement failed, continuing without it')

        # embeddings
        embeddings = _sbert_model.encode([cv_processed, job_processed], convert_to_numpy=True)
        emb_cv = embeddings[0]
        emb_job = embeddings[1]
        try:
            cosine_sim = float(cosine_similarity(emb_cv.reshape(1, -1), emb_job.reshape(1, -1))[0][0])
        except Exception:
            cosine_sim = 0.0

        # clip negative to 0 to keep score non-negative
        cosine_clipped = max(0.0, cosine_sim)
        raw_score = cosine_clipped * 100.0
        score_val = round(min(99.99, raw_score), 2)

        elapsed = int((time.time() - start) * 1000)
        logger.info('Scoring completed for application_id=%s with score=%.2f in %d ms', app_id, score_val, elapsed)
        return {"application_id": app_id, "score": score_val, "processing_time_ms": elapsed}
    except Exception as e:
        logger.exception('Scoring failed')
        elapsed = int((time.time() - start) * 1000)
        return {"application_id": payload.get('application_id'), "score": None, "processing_time_ms": elapsed, "error": str(e)}

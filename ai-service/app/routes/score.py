import logging
from flask import Blueprint, request
from app.utils.response import success, error
from app.utils.validators import validate_score_payload
from app.services.resume_job_scorer import score as scorer

score_bp = Blueprint('score', __name__)
logger = logging.getLogger(__name__)

@score_bp.post('/score-resume-job')
@score_bp.post('/score-cv-job')
def score_resume_job():
    try:
        payload = request.get_json(force=True)
    except Exception:
        return error('Invalid JSON payload', 'VALIDATION_ERROR', 400)

    ok, msg = validate_score_payload(payload)
    if not ok:
        return error(msg, 'VALIDATION_ERROR', 400)

    # perform scoring
    result = scorer(payload)
    if result.get('score') is None:
        # scoring failed internally
        return error('Scoring failed', 'SCORING_FAILED', 500, details={'processing_time_ms': result.get('processing_time_ms'), 'error': result.get('error')})

    return success('Scored successfully', result)

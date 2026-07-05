from app import logging_config
import os
import time
from typing import Dict
import pdfplumber
import logging

logger = logging.getLogger(__name__)

# Extract text from PDF file and return metadata
def extract_text(file_path: str) -> Dict:
    start = time.time()
    if not os.path.exists(file_path):
        logger.error(f'File not found: {file_path}')
        raise FileNotFoundError('file not found')

    text_parts = []
    page_count = 0
    try:
        with pdfplumber.open(file_path) as pdf:
            page_count = len(pdf.pages)
            for p in pdf.pages:
                txt = p.extract_text() or ''
                text_parts.append(txt)
    except Exception as e:
        logger.error(f'Failed to extract text from {file_path}: {str(e)}')
        raise RuntimeError(f'Failed to extract text: {str(e)}')

    extracted_text = '\n'.join([t for t in text_parts if t]).replace('\x00', '')
    file_size = os.path.getsize(file_path)
    processing_time_ms = int((time.time() - start) * 1000)

    logger.info(f'Text extraction completed: {page_count} pages, {file_size} bytes, {processing_time_ms} ms')
    logger.info(f'Extracted text: {extracted_text}')
    return {
        'extracted_text': extracted_text,
        'page_count': page_count,
        'file_size': file_size,
        'processing_time_ms': processing_time_ms,
    }

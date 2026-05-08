import logging
import os
import tempfile
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeoutError
from flask import Blueprint, request

from app.utils.validators import is_pdf_mimetype
from app.utils.response import success, error
from app.services.text_extractor import extract_text
from app.config import config

extract_bp = Blueprint('extract', __name__)
logger = logging.getLogger(__name__)

# Endpoint to extract text from uploaded PDF file
@extract_bp.post('/extract-text')
def extract_text_endpoint():
    f = request.files.get('file')
    if not f:
        logger.warning('No file provided in request')
        return error('No file provided', 'VALIDATION_ERROR', 400)

    if not is_pdf_mimetype(f.mimetype):
        logger.warning(f'Invalid file type: {f.mimetype}')
        return error('Invalid file type', 'INVALID_FILE_TYPE', 415)

    tmp = None
    try:
        # Save uploaded file to a temporary location
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        tmp.close()
        f.save(tmp.name)

        timeout = int(config.EXTRACTION_TIMEOUT_SEC)

        # Run extraction in a separate thread to enforce timeout
        with ThreadPoolExecutor(max_workers=1) as ex:
            future = ex.submit(extract_text, tmp.name)
            try:
                result = future.result(timeout=timeout)
            except FutureTimeoutError:
                logger.exception('Extraction timeout')
                return error('Extraction timed out', 'EXTRACTION_TIMEOUT', 504)
        logger.info(f'Text extraction successful: {result["page_count"]} pages, {result["file_size"]} bytes, {result["processing_time_ms"]} ms')
        return success('Text extracted successfully', result)
    except Exception as e:
        logger.exception('Failed to parse PDF')
        return error('Failed to parse PDF', 'PDF_PARSE_FAILED', 422)
    finally:
        # Clean up temporary file
        if tmp and os.path.exists(tmp.name):
            try:
                os.remove(tmp.name)
            except Exception:
                logger.warning(f'Failed to delete temp file: {tmp.name}')

def validate_score_payload(payload):
    if not isinstance(payload, dict):
        return False, "payload must be a JSON object"
    if "application_id" not in payload:
        return False, "application_id is required"
    if "extracted_text_resume" not in payload and "extracted_text_cv" not in payload:
        return False, "extracted_text_resume is required"
    if "job_info" not in payload or not isinstance(payload.get("job_info"), dict):
        return False, "job_info is required and must be an object"
    job_info = payload["job_info"]
    if "requirements" not in job_info or not isinstance(job_info.get("requirements"), list):
        return False, "job_info.requirements must be an array"
    if "descriptions" not in job_info or not isinstance(job_info.get("descriptions"), list):
        return False, "job_info.descriptions must be an array"
    return True, None

def is_pdf_mimetype(mimetype: str) -> bool:
    if not mimetype:
        return False
    return mimetype.lower() == 'application/pdf'


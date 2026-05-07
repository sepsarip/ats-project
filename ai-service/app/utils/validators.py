def is_pdf_mimetype(mimetype: str) -> bool:
    if not mimetype:
        return False
    return mimetype.lower() == 'application/pdf'


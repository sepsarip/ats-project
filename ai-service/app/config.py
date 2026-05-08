import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    EXTRACTION_TIMEOUT_SEC = int(os.getenv('EXTRACTION_TIMEOUT_SEC', '15'))
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', '5001'))


config = Config()

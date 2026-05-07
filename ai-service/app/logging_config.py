import logging
import os
import sys
from logging.handlers import TimedRotatingFileHandler


def configure_logging():
    os.makedirs('logs', exist_ok=True)
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(name)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

    file_handler = TimedRotatingFileHandler(
        filename='logs/app.log',
        when='midnight',
        interval=1,
        backupCount=7,
        encoding='utf-8'
    )

    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.INFO)

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

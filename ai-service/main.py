from dotenv import load_dotenv
from app.logging_config import configure_logging

load_dotenv()
configure_logging()

from flask import Flask
from app.routes.health import health_bp
from app.routes.extract import extract_bp
from app.config import config

def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(config)
    app.register_blueprint(health_bp)
    app.register_blueprint(extract_bp)
    return app

app = create_app()

if __name__ == "__main__":
    app.run(host=config.HOST, port=config.PORT)

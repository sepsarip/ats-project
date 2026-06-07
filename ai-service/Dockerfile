FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# download small SpaCy model during build
RUN python -m spacy download en_core_web_sm || true

# Pre-download SentenceTransformer model into image
RUN python - <<'PY'
from huggingface_hub import snapshot_download
import os
try:
	path = snapshot_download('sentence-transformers/all-MiniLM-L6-v2', cache_dir='/app/models')
	# create stable symlink path used by app
	try:
		os.symlink(path, '/app/models/all-MiniLM-L6-v2')
	except Exception:
		pass
except Exception:
	# best-effort: continue build even if download fails
	pass
PY

# set env var pointing to local model path
ENV SBERT_MODEL_PATH=/app/models/all-MiniLM-L6-v2

COPY . .

EXPOSE 5001

CMD ["gunicorn", "--capture-output", "--log-level", "info", "--bind", "0.0.0.0:5001", "main:app"]
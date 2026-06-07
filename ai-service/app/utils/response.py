from flask import jsonify
from typing import Any, Dict

def success(message: str = 'OK', data: Dict[str, Any] | None = None, status_code: int = 200):
    payload = {'status': 'success', 'message': message}
    if data is not None:
        payload['data'] = data
    else:
        payload['data'] = {}
    return jsonify(payload), status_code

def error(message: str, code: str | None = None, status_code: int = 500, details: Dict[str, Any] | None = None):
    payload = {'status': 'error', 'message': message}
    if code:
        payload['code'] = code
    if details is not None:
        payload['details'] = details
    return jsonify(payload), status_code

def accepted(message: str = 'Accepted', data: Dict[str, Any] | None = None):
    payload = {'status': 'accepted', 'message': message}
    if data is not None:
        payload['data'] = data
    else:
        payload['data'] = {}
    return jsonify(payload), 202

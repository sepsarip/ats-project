from flask import jsonify


def success(message: str = 'OK', data: dict | None = None):
    payload = {'status': 'success', 'message': message, 'data': data or {}}
    return jsonify(payload), 200


def error(message: str, code: str | None = None, status_code: int = 500):
    payload = {'status': 'error', 'message': message}
    if code:
        payload['code'] = code
    return jsonify(payload), status_code

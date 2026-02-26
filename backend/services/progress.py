import threading
from typing import Dict, Any

_lock = threading.Lock()
_store: Dict[str, Dict[str, Any]] = {}

def create_progress(upload_id: str, total_steps: int = 1):
    with _lock:
        _store[upload_id] = {
            'total': total_steps,
            'done': 0,
            'percent': 0,
            'status': 'running',
            'message': ''
        }

def update_progress(upload_id: str, done: int, message: str = ''):
    with _lock:
        if upload_id not in _store:
            return
        _store[upload_id]['done'] = done
        total = _store[upload_id].get('total', 1)
        percent = int((done / total) * 100) if total else 100
        _store[upload_id]['percent'] = percent
        if message:
            _store[upload_id]['message'] = message
        if done >= total:
            _store[upload_id]['status'] = 'completed'

def set_total(upload_id: str, total: int):
    with _lock:
        if upload_id not in _store:
            _store[upload_id] = {}
        _store[upload_id]['total'] = total

def finish_progress(upload_id: str, message: str = ''):
    with _lock:
        if upload_id not in _store:
            _store[upload_id] = {}
        _store[upload_id]['done'] = _store[upload_id].get('total', 1)
        _store[upload_id]['percent'] = 100
        _store[upload_id]['status'] = 'completed'
        if message:
            _store[upload_id]['message'] = message

def get_progress(upload_id: str):
    with _lock:
        return _store.get(upload_id, None)

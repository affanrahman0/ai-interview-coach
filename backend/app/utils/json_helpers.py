"""
Small helpers for storing Python lists as JSON text in SQLite/Postgres TEXT columns,
since several model fields (skills, strengths, etc.) are JSON-encoded lists.
"""

import json

# from string to json when saving to PostgreSQL
def to_json(value) -> str:
    return json.dumps(value or [])
    


# from json to list when reading from PostgreSQL and sending data to frontend
def from_json(value: str | None) -> list:
    if not value:
        return []
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return []

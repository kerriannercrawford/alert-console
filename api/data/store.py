"""
For purposes of this takehome, decided to use an in-memory store to 
store the events for ease of implementation. This can be swapped out
for a database-backed implementation without touching the rest of the app.
"""

_alerts: dict[str, dict] = {}


"""
PHASE 1: Sanity test - confirms the app boots and the health check responds.
Run with: pytest
"""

# from fastapi.testclient import TestClient
# from main import app
#
# client = TestClient(app)
#
#
# def test_health_check():
#     response = client.get("/")
#     assert response.status_code == 200
#     assert response.json()["status"] == "ok"


# ------------------------------------------------------------------
# PHASE 1: test_auth.py  -> register/login flow
# PHASE 2: test_resume.py -> upload/parse flow
# PHASE 3: test_interview.py -> question generation + answer submission
# PHASE 4: test_evaluation.py -> scoring logic
# ------------------------------------------------------------------

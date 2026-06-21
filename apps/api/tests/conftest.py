"""
Shared pytest fixtures untuk Arnol Works API tests.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session")
def client():
    """TestClient yang bisa dipakai di seluruh test session."""
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c
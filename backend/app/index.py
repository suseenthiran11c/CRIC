"""
Vercel Python Serverless Entry Point
This file is required by Vercel's @vercel/python builder.
It imports and re-exports the FastAPI 'app' instance from main.py.
"""
from app.main import app

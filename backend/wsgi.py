import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

# Import the Flask app
from app import app

if __name__ == "__main__":
    # For Windows, use waitress
    from waitress import serve
    serve(app, host='0.0.0.0', port=5000)
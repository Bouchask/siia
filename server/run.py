import sys
import os

# Add the server directory to sys.path so 'app' can be found
sys.path.append(os.path.dirname(__file__))

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

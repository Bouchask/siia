from flask import jsonify
from sqlalchemy import text
from app import create_app, db

app = create_app()

@app.route('/api/db-test')
def db_test():
    try:
        # Attempt to execute a simple query
        db.session.execute(text('SELECT 1'))
        return jsonify({"status": "success", "message": "Database connected successfully!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

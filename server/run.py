from flask import jsonify
from sqlalchemy import text
from app import create_app, db

app = create_app()

@app.route('/api/db-test')
def db_test():
    try:
        # Attempt to execute a simple query
        db.session.execute(text('SELECT 1'))
        return jsonify({
            "status": "success", 
            "message": "Database connected successfully!",
            "database_uri_configured": bool(app.config.get('SQLALCHEMY_DATABASE_URI'))
        }), 200
    except Exception as e:
        import traceback
        return jsonify({
            "status": "error", 
            "message": str(e),
            "traceback": traceback.format_exc(),
            "uri_redacted": app.config.get('SQLALCHEMY_DATABASE_URI').split('@')[-1] if app.config.get('SQLALCHEMY_DATABASE_URI') else None
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

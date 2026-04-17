import os
from app import create_app, db
from app.models.user import User

def seed_admin():
    """
    Seeds a default admin user into the database if one does not already exist.
    """
    app = create_app()
    with app.app_context():
        email = "admin@siia.com"
        
        # 1. Check if admin already exists
        existing_admin = User.query.filter_by(email=email).first()
        if existing_admin:
            print(f"[*] Admin user '{email}' already exists. Skipping...")
            return

        print(f"[*] Creating initial admin account for {email}...")

        # 2. Create the Admin User
        # Using the model's structure: first_name, last_name, email, role, password_hash
        admin = User(
            email=email,
            first_name="Admin",
            last_name="System",
            role="admin"
        )
        
        # 3. Hash the password safely using the model's helper method
        admin.set_password("password123")

        try:
            # 4. Save to Database
            db.session.add(admin)
            db.session.commit()
            print("[+] Admin account created successfully!")
            print(f"    Email: {email}")
            print(f"    Password: password123")
            print("    Role: Admin")
        except Exception as e:
            db.session.rollback()
            print(f"[!] Error creating admin: {e}")

if __name__ == "__main__":
    seed_admin()

from app import create_app, db
from app.models.user import User
from app.models.announcement import Announcement
from app.models.academic import Semester, Course
import uuid

def seed_data():
    app = create_app()
    with app.app_context():
        print("Seeding Academic Semesters...")
        
        # 1. Define Semester Names
        license_semesters = ["S5", "S6"]
        master_semesters = ["S7", "S8", "S9", "S10"]
        all_sem_names = license_semesters + master_semesters

        for name in all_sem_names:
            existing = Semester.query.filter_by(name=name).first()
            if not existing:
                new_sem = Semester(name=name)
                db.session.add(new_sem)
                print(f"Created Semester: {name}")
        
        db.session.commit()

        # 2. Add some sample courses to S7 and S8 (as requested before)
        s7 = Semester.query.filter_by(name='S7').first()
        s8 = Semester.query.filter_by(name='S8').first()
        prof = User.query.filter_by(role='professor').first()

        if s7 and prof:
            course_data = [
                {"name": "Cloud Computing", "semester_id": s7.id},
                {"name": "Visualisation des données", "semester_id": s7.id}
            ]
            for c in course_data:
                if not Course.query.filter_by(name=c['name']).first():
                    new_c = Course(name=c['name'], semester_id=c['semester_id'], professor_id=prof.id)
                    db.session.add(new_c)
                    print(f"Added Course '{c['name']}' to S7")

        if s8 and prof:
            if not Course.query.filter_by(name="Deep Learning").first():
                new_c = Course(name="Deep Learning", semester_id=s8.id, professor_id=prof.id)
                db.session.add(new_c)
                print(f"Added Course 'Deep Learning' to S8")

        db.session.commit()
        print("Academic structure seeded successfully!")

if __name__ == "__main__":
    seed_data()

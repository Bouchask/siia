from app import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Semester(db.Model):
    __tablename__ = 'semesters'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False) # e.g., S5, S6
    
    courses = db.relationship('Course', backref='semester', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'courses_count': len(self.courses),
            'courses': [c.to_dict() for c in self.courses]
        }

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=False)
    professor_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)

    # Relationship to the professor (User model)
    professor = db.relationship('User', backref='assigned_courses')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'semester_id': self.semester_id,
            'semester_name': self.semester.name if self.semester else None,
            'professor_id': str(self.professor_id) if self.professor_id else None,
            'professor_name': f"{self.professor.first_name} {self.professor.last_name}" if self.professor else "Not Assigned"
        }

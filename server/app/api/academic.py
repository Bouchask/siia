from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.academic import Semester, Course
from app.models.user import User
from app import db
from app.utils.decorators import requires_role

academic_bp = Blueprint('academic', __name__)

# --- Semesters ---
@academic_bp.route('/semesters', methods=['GET'])
def get_semesters():
    semesters = Semester.query.all()
    return jsonify([s.to_dict() for s in semesters]), 200

@academic_bp.route('/semesters', methods=['POST'])
@jwt_required()
@requires_role('admin')
def create_semester():
    data = request.get_json()
    new_sem = Semester(name=data.get('name'))
    db.session.add(new_sem)
    db.session.commit()
    return jsonify(new_sem.to_dict()), 201

# --- Courses ---
@academic_bp.route('/courses', methods=['GET'])
def get_all_courses():
    courses = Course.query.all()
    return jsonify([c.to_dict() for c in courses]), 200

@academic_bp.route('/courses', methods=['POST'])
@jwt_required()
@requires_role('admin')
def create_course():
    data = request.get_json()
    new_course = Course(
        name=data.get('name'),
        semester_id=data.get('semester_id'),
        professor_id=data.get('professor_id')
    )
    db.session.add(new_course)
    db.session.commit()
    return jsonify(new_course.to_dict()), 201

@academic_bp.route('/courses/<int:id>', methods=['DELETE'])
@jwt_required()
@requires_role('admin')
def delete_course(id):
    course = Course.query.get_or_404(id)
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course deleted"}), 200

# --- Professors List (Helpers for dropdown) ---
@academic_bp.route('/professors', methods=['GET'])
@jwt_required()
@requires_role('admin')
def get_professors():
    profs = User.query.filter_by(role='professor').all()
    return jsonify([{"id": str(p.id), "name": f"{p.first_name} {p.last_name}"} for p in profs]), 200

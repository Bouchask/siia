from app import db

class Setting(db.Model):
    __tablename__ = 'settings'

    key = db.Column(db.String(50), primary_key=True)
    value = db.Column(db.Text, nullable=False)

    @staticmethod
    def get(key, default=None):
        setting = Setting.query.get(key)
        return setting.value if setting else default

    @staticmethod
    def get_all_by_prefix(prefix):
        return Setting.query.filter(Setting.key.like(f"{prefix}%")).all()

    @staticmethod
    def set(key, value):
        try:
            setting = Setting.query.get(key)
            if setting:
                setting.value = value
            else:
                setting = Setting(key=key, value=value)
                db.session.add(setting)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"DATABASE ERROR (Setting.set): {str(e)}")
            raise e

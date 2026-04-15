from app import db

class Setting(db.Model):
    __tablename__ = 'settings'

    key = db.Column(db.String(50), primary_key=True)
    value = db.Column(db.String(500), nullable=False)

    @staticmethod
    def get(key, default=None):
        setting = Setting.query.get(key)
        return setting.value if setting else default

    @staticmethod
    def set(key, value):
        setting = Setting.query.get(key)
        if setting:
            setting.value = value
        else:
            setting = Setting(key=key, value=value)
            db.session.add(setting)
        db.session.commit()

"""Auth service."""
from app.core.security import hash_password, verify_password, create_access_token
from app.config import settings

class AuthService:
    def register(self, db, username, email, password):
        from app.models.user import User
        password_hash = hash_password(password)
        user = User(username=username, email=email, password_hash=password_hash)
        db.add(user)
        db.commit()
        db.refresh(user)
        token = create_access_token({"sub": str(user.id)}, settings.SECRET_KEY)
        return user, token

    def login(self, db, email, password):
        from app.models.user import User
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            return None
        token = create_access_token({"sub": str(user.id)}, settings.SECRET_KEY)
        return user, token

auth_service = AuthService()

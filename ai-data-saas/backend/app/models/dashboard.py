from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import Base
from datetime import datetime

class Dashboard(Base):
    __tablename__ = "dashboards"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    name = Column(String)
    data = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

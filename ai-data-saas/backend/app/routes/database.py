from fastapi import APIRouter, HTTPException
from sqlalchemy import create_engine, text
import os

router = APIRouter(prefix="/database")

@router.post("/connect")
async def connect_to_database(host: str, port: int, database: str, username: str, password: str, driver: str = "postgresql"):
    try:
        # Construct connection URL
        if driver == "postgresql":
            url = f"postgresql://{username}:{password}@{host}:{port}/{database}"
        elif driver == "mysql":
            url = f"mysql+pymysql://{username}:{password}@{host}:{port}/{database}"
        elif driver == "sqlserver":
            url = f"mssql+pyodbc://{username}:{password}@{host}:{port}/{database}?driver=ODBC+Driver+17+for+SQL+Server"
        else:
            raise HTTPException(status_code=400, detail="Unsupported driver")

        # Test connection
        engine = create_engine(url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()

        return {"status": "connected", "message": "Successfully connected to the database"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connection failed: {str(e)}")

@router.post("/tables")
async def get_tables(host: str, port: int, database: str, username: str, password: str, driver: str = "postgresql"):
    try:
        if driver == "postgresql":
            url = f"postgresql://{username}:{password}@{host}:{port}/{database}"
        elif driver == "mysql":
            url = f"mysql+pymysql://{username}:{password}@{host}:{port}/{database}"
        elif driver == "sqlserver":
            url = f"mssql+pyodbc://{username}:{password}@{host}:{port}/{database}?driver=ODBC+Driver+17+for+SQL+Server"
        else:
            raise HTTPException(status_code=400, detail="Unsupported driver")

        engine = create_engine(url)
        with engine.connect() as conn:
            if driver == "postgresql":
                result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            elif driver == "mysql":
                result = conn.execute(text("SHOW TABLES"))
            elif driver == "sqlserver":
                result = conn.execute(text("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"))
            tables = [row[0] for row in result.fetchall()]

        return {"tables": tables}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch tables: {str(e)}")
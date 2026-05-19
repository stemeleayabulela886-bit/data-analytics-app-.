from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, text
import re

router = APIRouter(prefix="/database")

class DatabaseConfig(BaseModel):
    host: str
    port: int
    database: str
    username: str
    password: str
    driver: str = "postgresql"

class TableDataRequest(DatabaseConfig):
    table_name: str


def build_connection_url(config: DatabaseConfig) -> str:
    if config.driver == "postgresql":
        return f"postgresql://{config.username}:{config.password}@{config.host}:{config.port}/{config.database}"
    if config.driver == "mysql":
        return f"mysql+pymysql://{config.username}:{config.password}@{config.host}:{config.port}/{config.database}"
    if config.driver == "sqlserver":
        return f"mssql+pyodbc://{config.username}:{config.password}@{config.host}:{config.port}/{config.database}?driver=ODBC+Driver+17+for+SQL+Server"
    raise HTTPException(status_code=400, detail="Unsupported driver")

@router.post("/connect")
async def connect_to_database(config: DatabaseConfig):
    try:
        url = build_connection_url(config)
        engine = create_engine(url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()

        return {"status": "connected", "message": "Successfully connected to the database"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connection failed: {str(e)}")

@router.post("/tables")
async def get_tables(config: DatabaseConfig):
    try:
        url = build_connection_url(config)
        engine = create_engine(url)
        with engine.connect() as conn:
            if config.driver == "postgresql":
                result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            elif config.driver == "mysql":
                result = conn.execute(text("SHOW TABLES"))
            elif config.driver == "sqlserver":
                result = conn.execute(text("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"))
            tables = [row[0] for row in result.fetchall()]

        return {"tables": tables}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch tables: {str(e)}")

@router.post("/table-data")
async def get_table_data(request: TableDataRequest):
    if not re.match(r"^[A-Za-z0-9_]+$", request.table_name):
        raise HTTPException(status_code=400, detail="Invalid table name")

    try:
        url = build_connection_url(request)
        engine = create_engine(url)
        with engine.connect() as conn:
            if request.driver == "sqlserver":
                query = text(f"SELECT TOP 100 * FROM {request.table_name}")
            else:
                query = text(f"SELECT * FROM {request.table_name} LIMIT 100")
            result = conn.execute(query)
            rows = [dict(row._mapping) for row in result.fetchall()]

        return {"rows": rows}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch table data: {str(e)}")

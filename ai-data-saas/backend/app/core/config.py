from pydantic import BaseSettings

class Settings(BaseSettings):
    app_name: str = "AI Data SaaS"
    database_url: str = "sqlite:///./test.db"
    secret_key: str = "supersecret"

    class Config:
        env_file = ".env"

settings = Settings()

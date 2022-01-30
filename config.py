import os
from dotenv import load_dotenv


baseDir = os.getcwd()
load_dotenv(os.path.join(baseDir, ".env"))


# Configuration Classes
class BaseConfig:
    """
    BaseConfig class contains all the common configurations
    which will be used in Development, Testing and
    Production phase of the application
    """

    SECRET_KEY = os.getenv("SECRET_KEY", os.urandom(16).hex())
    SQLALCHEMY_DATABASE_URI = "sqlite:///Database/memory.sqlite3"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(baseDir, "static", "images")
    MAX_CONTENT_LENGTH = 8 * 1024 * 1024


class DevConfig(BaseConfig):
    FLASK_ENV = "development"

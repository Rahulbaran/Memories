import os
from dotenv import load_dotenv


baseDir = os.getcwd()
load_dotenv(os.path.join(baseDir, ".env"))


# Configuration Classes
class BaseConfig:
    """
    BaseConfig class contains all the common configurations
    which will be used in Development, Testing and
    Production phase
    """

    SECRET_KEY = os.getenv("SECRET_KEY", os.urandom(16).hex())


class DevConfig(BaseConfig):
    FLASK_ENV = "development"

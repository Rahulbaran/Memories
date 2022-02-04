from datetime import datetime
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_moment import Moment
from config import DevConfig
from utils import uploadImage, deleteImage


app = Flask(__name__)
app.config.from_object(DevConfig)
db = SQLAlchemy(app)
moment = Moment(app)


# MODELS
class Memory(db.Model):
    __tablename__ = "memories"
    id = db.Column(db.Integer, primary_key=True)
    creator = db.Column(db.String(30), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    tags = db.Column(db.String(50))
    image = db.Column(db.String(30), nullable=False)
    created_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    total_likes = db.Column(db.Integer, nullable=False, default=0)


# Function to save data in database
def saveData(data, pic):
    creator, title, message, tags = data.get("creator"), data.get("title"), data.get("message"), data.get("tags")
    try:
        image = uploadImage(pic)
        if image:
            memory = Memory(creator=creator, title=title, message=message, tags=tags, image=image)
            db.session.add(memory)
            db.session.commit()
            return Memory.query.filter_by(image=image).first()
        else:
            return None
    except:
        return None


memory__id = 0

# ROUTES
@app.route("/", methods=["GET", "POST"])
@app.route("/home", methods=["GET", "POST"])
def home():
    allMemories = Memory.query.all()
    if request.method == "POST":
        memoryData = request.form
        pic = request.files.get("card-image")
        try:
            data = saveData(memoryData, pic)
            if data:
                return {
                    "id": data.id,
                    "creator": data.creator,
                    "title": data.title,
                    "message": data.message,
                    "image": data.image,
                    "tags": data.tags.split(","),
                    "created_on": data.created_on,
                }
            else:
                return {"code": 404, "message": "Couldn't create the memory"}
        except ConnectionError:
            return {"code": 500, "message": "Server is down"}
        except:
            return {"code": 404, "message": "Couldn't create the memory"}
    return render_template("home.html", title="Memories", memories=allMemories)


@app.route("/memoryLike", methods=["POST"])
def memoryLike():
    memoryId = request.get_json().get("memoryId")
    memory = Memory.query.filter_by(id=memoryId).first()
    memory.total_likes = memory.total_likes + 1
    db.session.commit()
    return {"total Likes": memory.total_likes}


@app.route("/deleteMemory", methods=["POST"])
def deleteMemory():
    memoryId = request.get_json().get("memoryId")
    try:
        memory = Memory.query.filter_by(id=memoryId).first()
        success = deleteImage(memory.image)
        if success:
            db.session.delete(memory)
            db.session.commit()
            return {"message": "success"}
        else:
            return {"code": 404, "message": "memory does not exist"}
    except ConnectionError:
        return {"code": 500, "message": "Server is down"}
    except:
        return {"code": 404, "message": "memory does not exist"}


@app.route("/editMemory", methods=["POST"])
def editMemory():
    memoryId = request.get_json().get("memoryId")
    try:
        memory = Memory.query.get_or_404(memoryId)
        return {
            "creator": memory.creator,
            "title": memory.title,
            "message": memory.message,
            "tags": memory.tags
        }
    except ConnectionError:
        return {"code": 500, "message": "Server is down"}
    except:
        return {"code": 404, "message": "memory does not exist"}


# RUNNING APPLICATION IN PYTHON STYLE
if __name__ == "__main__":
    app.run(load_dotenv=True, port=5050, debug=True)

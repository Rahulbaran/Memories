import os, secrets
from flask import Flask, render_template, redirect, url_for, abort, request
from flask_sqlalchemy import SQLAlchemy
from config import DevConfig


app = Flask(__name__)
app.config.from_object(DevConfig)

# ROUTES
@app.route("/", methods=["GET", "POST"])
def home():
    return render_template("home.html", title="Memories")
app.add_url_rule("/home", "home", home)


# RUNNING APPLICATION IN PYTHON STYLE
if __name__ == "__main__":
    app.run(load_dotenv=True, port=5050, debug=True)

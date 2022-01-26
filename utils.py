import secrets, os
from PIL import Image


def uploadImage(pic):
    hex_token = secrets.token_bytes(8).hex()
    _, ext = os.path.splitext(pic.filename)
    mod_pic = hex_token + ext
    path = os.path.join(os.getcwd(), "static", "images", mod_pic)

    size = (360, 360)
    img = Image.open(pic)
    img.thumbnail(size)
    img.save(path)

    return mod_pic

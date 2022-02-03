import secrets, os
from PIL import Image


imgFolder = os.path.join(os.getcwd(), "static", "images")


def uploadImage(pic):
    hex_token = secrets.token_bytes(8).hex()
    _, ext = os.path.splitext(pic.filename)
    other_pic = hex_token + ext
    webp_pic = hex_token + ".webp"

    size = (360, 300)
    img = Image.open(pic)
    img.thumbnail(size)
    img.save(os.path.join(imgFolder, webp_pic), "webp")
    img.save(os.path.join(imgFolder, other_pic))
    return other_pic


def deleteImage(pic):
    try:
        hex_code, _ = os.path.splitext(pic)
        webP = hex_code + ".webp"
        imgPaths = [os.path.join(imgFolder, webP), os.path.join(imgFolder, pic)]
        for img in imgPaths:
            os.remove(img)
        return True
    except:
        return False

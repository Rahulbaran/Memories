import secrets, os
from PIL import Image


def uploadImage(pic):
    hex_token = secrets.token_bytes(8).hex()
    _, ext = os.path.splitext(pic.filename)
    other_pic = hex_token + ext
    webp_pic = hex_token + ".webp"
    img_folder = os.path.join(os.getcwd(), "static", "images")

    size = (360, 300)
    img = Image.open(pic)
    img.thumbnail(size)
    img.save(os.path.join(img_folder, webp_pic), "webp")
    img.save(os.path.join(img_folder, other_pic))

    print(other_pic, webp_pic)

    return other_pic

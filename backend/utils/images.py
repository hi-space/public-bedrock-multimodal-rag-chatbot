import os
import requests
import base64
import shutil
from io import BytesIO
from PIL import Image
from fastapi import File, UploadFile
from IPython.display import display, HTML

from common.logger import logger


UPLOAD_FOLDER = '.img'

def save_image_file(file: UploadFile = File(...)):
    try:
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file_location = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return file.filename
    except Exception as e:
        logger.error(e)
        return ''

async def image_to_base64(file: UploadFile = File(None)):
    try:
        img = Image.open(BytesIO(await file.read()))

        max_size = 2000
        if img.width > max_size or img.height > max_size:
            scale = min(max_size / img.width, max_size / img.height)
            img = img.resize((int(img.width * scale), int(img.height * scale)))
                
        buffered = BytesIO()
        img.save(buffered, format="webp")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return img_str
    except Exception as e:
        logger.error(e)
        return ''
    
def imagefile_to_base64(filename):
    try:
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        img = Image.open(filepath)
        im_file = BytesIO()
        img.save(im_file, format="webp")
        im_bytes = im_file.getvalue()
        im_b64 = base64.b64encode(im_bytes)
        os.remove(filepath)
        return im_b64.decode('utf-8')
    except Exception as e:
        logger.error(e)
        return ''
    

def display_image(utf8):
    html = f'<img src="data:image/webp;base64,{utf8}" width="100"/>'
    display(HTML(html))


def encode_image_base64(img_url):
    '''이미지 데이터를 base64로 인코딩'''
    try:
        response = requests.get(img_url, timeout=5)
        image_data = response.content
        encoded_image = base64.b64encode(image_data)
        decoded_image = encoded_image.decode('utf8')
        # display_image(decoded_image)
        return decoded_image
    except Exception as e:
        print(e)
    return None
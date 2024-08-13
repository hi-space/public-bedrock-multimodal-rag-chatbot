import base64
import requests
from PIL import Image
from io import BytesIO


def encode_image_base64(img_url):
    '''이미지 데이터를 base64로 인코딩하며, width나 height가 2000을 넘지 않도록 리사이즈'''
    try:
        response = requests.get(img_url, timeout=5)
        image_data = response.content

        # 이미지를 열고 리사이즈
        image = Image.open(BytesIO(image_data))
        max_size = (2000, 2000)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)

        # 이미지를 바이트 스트림으로 변환
        buffer = BytesIO()
        image.save(buffer, format="JPEG")
        resized_image_data = buffer.getvalue()

        # 이미지를 base64로 인코딩
        encoded_image = base64.b64encode(resized_image_data)
        decoded_image = encoded_image.decode('utf8')
        return decoded_image
    except Exception as e:
        print(e)
    return None


def encode_image_base64_from_file(file_path):
    try:
        with open(file_path, 'rb') as img_file:
            image_data = img_file.read()

        image = Image.open(BytesIO(image_data))
        max_size = (2000, 2000)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)

        buffer = BytesIO()
        image.convert("RGB").save(buffer, format="JPEG")
        resized_image_data = buffer.getvalue()

        encoded_image = base64.b64encode(resized_image_data)
        decoded_image = encoded_image.decode('utf8')
        return decoded_image
    except Exception as e:
        print(e)
    return None

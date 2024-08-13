import os
import json
import random

from notebook_utils import display_image
from utils import encode_image_base64
from config import config


def get_item(product_id):
    json_file_path = os.path.join(config.DATA_FOLDER,
                                f'{product_id}' if product_id.endswith('.json') else f'{product_id}.json')
    
    with open(json_file_path, 'r') as f:
        json_data = json.load(f).get('data', {})

        data = {
            'id': str(json_data.get('id', '')),
            'price': int(json_data.get('price', '0')) * 100,
            'productDisplayName': json_data.get('productDisplayName', ''),
            'variantName': json_data.get('variantName', ''),
            'brandName': json_data.get('brandName', ''),
            'ageGroup': json_data.get('ageGroup', ''),
            'gender': json_data.get('gender', ''),
            'fashionType': json_data.get('fashionType', ''),
            'season': json_data.get('season', ''),
            'year': json_data.get('year', ''),
            'usage': json_data.get('usage', ''),
            'displayCategories': json_data.get('displayCategories', ''),
            'thumbnail': json_data.get('styleImages', {}).get('default', {}).get('resolutions', '').get('360X480', ''),
            'styleImages_default': json_data.get('styleImages', {}).get('default', {}).get('imageURL', ''),
            'masterCategory': json_data.get('masterCategory', {}).get('typeName', ''),
            'subCategory': json_data.get('subCategory', {}).get('typeName', ''),
            'articleType': json_data.get('articleType', {}).get('typeName', ''),
            'productDescriptors': json_data.get('productDescriptors', {}).get('description', {}).get('value', '')
        }

        return data

def get_random_item():
    return get_item(f'{random.sample(get_json_files(), 1)[0]}')

def get_json_files():
    return [f for f in os.listdir(config.DATA_FOLDER) if f.endswith('.json')]

def show_item(item, detail=False):
    display_image(encode_image_base64(item['thumbnail']))
    print(f"[{item.get('id')}] {item.get('productDisplayName')}")
    if detail:
        print(json.dumps(item, indent=4))

def augment_text(item: dict):
    text = (item.get('productDisplayName', '') or '') + ', ' + \
                (item.get('namekor', '') or '') + ', '
    
    if item.get('gender'):
        text += f"{item.get('gender')} 용으로 "

    if item.get('ageGroup'):
        text += f"{item.get('ageGroup')} 대상으로 "

    if item.get('year'):
        text += str(item.get('year')) + '년도에 '

    if item.get('brandName'):
        text += f"{item.get('brandName')} 브랜드에서 출시된 제품 입니다. "
    
    if item.get('season'):
        text += f"{item.get('season')}에 착용 하기 좋은 아이템 입니다. "

    if item.get('displayCategories'):
        text += f"분류는 {item.get('displayCategories').replace(',', ', ')} 입니다. "

    if item.get('price'):
        text += '가격은 ' + str(item.get('price')) + "원 입니다. "

    return text


import pandas as pd
from typing import List
from functools import wraps
from aws.opensearch import OpenSearchWrapper
from utils import encode_image_base64
from IPython.display import display, HTML


def display_image(utf8):
    html = f'<img src="data:image/webp;base64,{utf8}" height="100"/>'
    display(HTML(html))


def show_df(df):
    df['thumbnail'] = df['thumbnail'].apply(
        lambda url: f'<img src="data:image/png;base64,{encode_image_base64(url)}" width="50" height="50">'
    )
    display(HTML(df.to_html(escape=False, index=False)))


def show_search_results(documents, max=5):
    data = []
    for idx, doc in enumerate(documents):
        source = doc.get('_source', {})
        metadata = source.get('metadata', {})
        score = doc.get('_score', 0)
        data.append({
            'id': metadata.get('id', ''),
            'embedType': metadata.get('embedType', ''),
            'thumbnail': metadata.get('thumbnail', ''),
            'page_content': source.get('text', ''),
            'score': score
        })

        if idx >=max:
            break

    df = pd.DataFrame(data)
    df['thumbnail'] = df['thumbnail'].apply(
        lambda url: f'<img src="data:image/png;base64,{encode_image_base64(url)}" width="50" height="50">'
    )

    display(HTML(df.to_html(escape=False, index=False)))


def log_query_and_results(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        text = kwargs.get('text', None) if 'text' in kwargs else None
        image = kwargs.get('image', None) if 'image' in kwargs else None

        print('======= Query ========')
        print(text)
        if image:
            display_image(image)

        docs = func(*args, **kwargs)

        print('======= Results ========')
        show_search_results(docs)
        
        return docs
    
    return wrapper


def update_doc_to_index(opensearch: OpenSearchWrapper, item: dict, vector: List, text: str, embedType: str):
    id = str(item.get('id'))
    namekor = item.get('namekor')
    nameeng = item.get('productDisplayName')
    thumbnail = item.get('thumbnail')

    opensearch.update_doc(
        id= f'{id}-{embedType}',
        body={
            'vector_field': vector,
            'text': text,
            'metadata': {
                'id': id,
                'embedType': embedType,
                'productDisplayName': nameeng,
                'namekor': namekor,
                'thumbnail': thumbnail,
            }
        }
    )

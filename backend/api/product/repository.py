
from db.dynamodb import DynamoDB
from db.opensearch import OpenSearchWrapper
from common.logger import logger
from config import config


class ProductDB():
    def __init__(self):
        self.db = DynamoDB(table_name=config.DYNAMODB_TABLE)
       
    def insert_product_item(self, item: dict):
        try:
            self.db.put_item(item=item)
            return item
        except Exception as e:
            logger.error(e)
            return None
    
    def get_item_by_id(self, id):
        try:
            return self.db.get_item(key=id)
        except Exception as e:
            return None
    
    def get_items(self, key=None, page_size=10, query=''):
        try:
            if query:
                items = self.search_from_os(query.lower())
                return {
                    'startKey': None,
                    'lastKey': None,
                    'totalCount': len(items),
                    'results': items,
                }
            else:    
                scan_kwargs = {
                    'Limit': page_size,
                }

            if key:
                scan_kwargs['ExclusiveStartKey'] = {
                    'id': key
                }

            response = self.db.query_item(scan_kwargs)
            items = response.get('Items', [])
            last_evaluated_key = response.get('LastEvaluatedKey', {})

            return {
                'startKey': key,
                'lastKey': last_evaluated_key.get('id', None),
                'totalCount': len(items),
                'results': items,
            }            
        except Exception as e:
            logger.error(e)
            return {
                'startKey': None,
                'lastKey': None,
                'totalCount': 0,
                'results': [],
            }

    def search_from_os(self, query):
        res = OpenSearchWrapper(index=config.OPENSEARCH_TEXT_INDEX).search({
            "query": {
                "query_string": {
                    "query": query + "*",
                    "fields": ["metadata.productDisplayName", "metadata.namekor", "metadata.id"]
                }
            },
            "collapse": {
                "field": "metadata.id"
            }
        })
        return [r.get('metadata', {}) for r in res]

    def remove_item(self, id: str):
        self.db.delete_item(id=id)
        return id

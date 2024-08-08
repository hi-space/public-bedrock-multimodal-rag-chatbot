import boto3
import json
from decimal import Decimal

from config import config
from common.logger import logger


class DynamoDB:
    def __init__(self, table_name):
        self.db = boto3.resource('dynamodb',
                                    region_name=config.AWS_REGION,
                                    aws_access_key_id=config.AWS_ACCESS,
                                    aws_secret_access_key=config.AWS_SECRET)
        
        self.name = table_name
        self.table = self.db.Table(table_name)
        
    def get_item(self, key):
        try:
            response = self.table.get_item(Key={
                'id': key
            })
            return json.loads(json.dumps(response.get('Item'), default=_decimal_default))
        except Exception as e:
            logger.error('[DynamoDB] {}'.format(e))
        return None
    
    def put_item(self, item: dict):
        try:
            self.table.put_item(
                Item=json.loads(json.dumps(item), parse_float=Decimal)
            )
        except Exception as e:
            logger.error('[DynamoDB] {}'.format(e))

    def delete_item(self, id):
        try:
            self.table.delete_item(Key={"id": id})
        except Exception as e:
            logger.error('[DynamoDB] {}'.format(e))

    def query_item(self, query):
        return self.table.scan(**query)


def _decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

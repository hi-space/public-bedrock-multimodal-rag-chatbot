import boto3
import json
from decimal import Decimal

from config import config


class DynamoDBWrapper:
    def __init__(self, table_name=config.DYNAMODB_TABLE):
        self.db = boto3.resource(
            'dynamodb',
            region_name=config.AWS_REGION,
            aws_access_key_id=config.AWS_ACCESS_KEY,
            aws_secret_access_key=config.AWS_SECRET_KEY
        )
        
        self.name = table_name
        self.table = self.db.Table(table_name)
        
    def get_item(self, key):
        try:
            response = self.table.get_item(Key={
                'id': key
            })

            return json.loads(json.dumps(response.get('Item'), default=DynamoDBWrapper._decimal_default))
                
        except Exception as e:
            print('[DynamoDB error] {}'.format(e))

        return None
    
    def put_item(self, item: dict):
        self.table.put_item(
            Item=json.loads(json.dumps(item), parse_float=Decimal)
        )        
    
    def update_field(self, key, fieldName, newValue):
        try:
            self.table.update_item(
                Key={'id': key},
                UpdateExpression=f'SET {fieldName} = :val',
                ExpressionAttributeValues={':val': newValue}
            )
        except Exception as e:
            print('[DynamoDB error] {}'.format(e))
    
    def query(self, query):
        return self.table.scan(**query)

    def query_item(self, query):
        try:
            res = self.table.scan(**query)
            return res.get('Items', [])
        except Exception as e:
            print('[DynamoDB error] {}'.format(e))
            return []

    @staticmethod
    def _decimal_default(obj):
        if isinstance(obj, Decimal):
            return float(obj)
        raise TypeError

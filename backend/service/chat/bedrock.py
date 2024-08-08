import boto3

from config import config


class BedrockWrapper():
    def __init__(self):
        self.region = config.BEDROCK_REGION
        self.client = boto3.client(
            service_name="bedrock",
            region_name=self.region,
            aws_access_key_id=config.AWS_ACCESS,
            aws_secret_access_key=config.AWS_SECRET,
        )

    '''
    Check to foundation models
    '''
    def list_foundation_models(self):
        return self.client.list_foundation_models()
    
    def decribe_foundation_model(self):
        return self.client.get_foundation_model(
            modelIdentifier=self.modelId
        )

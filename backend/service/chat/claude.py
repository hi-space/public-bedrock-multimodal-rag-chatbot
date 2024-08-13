import boto3
import json
from botocore.config import Config

from langchain_aws.chat_models import ChatBedrock
from langchain.callbacks import StdOutCallbackHandler

from config import config
from common.logger import logger
from utils.images import encode_image_base64


class BedrockClaude():
    def __init__(self,
                 modelId = config.BEDROCK_MODEL):

        self.region = config.BEDROCK_REGION
        self.modelId = modelId
        self.bedrock = boto3.client(
            service_name = 'bedrock-runtime',
            aws_access_key_id=config.AWS_ACCESS,
            aws_secret_access_key=config.AWS_SECRET,
            region_name = self.region,
            config = Config(
                connect_timeout=120,
                read_timeout=120,
                retries={'max_attempts': 5}
            ),
        )

        # https://docs.aws.amazon.com/ko_kr/bedrock/latest/userguide/model-parameters.html?icmpid=docs_bedrock_help_panel_playgrounds
        self.model_kwargs = {
            'anthropic_version': 'bedrock-2023-05-31',
            "max_tokens": 4096, # max tokens
            "temperature": 0.1, # [0, 1]
            "top_p": 0.9, # [0, 1]
            "top_k": 250, # [0, 500]
            "stop_sequences": ['Human:', 'H: ']
        }


    '''
    Langchain API: get ChatBedrock
    '''
    def get_chat_model(self, callback=StdOutCallbackHandler(), streaming=True):
        return ChatBedrock(
            model_id = self.modelId,
            client = self.bedrock,
            streaming = streaming,
            callbacks = [callback],
            model_kwargs = self.model_kwargs,
        )
    

    '''
    Bedrock API: invoke LLM model
    Reference: https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html
    '''    
    def invoke_llm(self, question: str, imgUrl: str = None, system: str = None):
        '''
        Returns:
            dict: ['id', 'type', 'role', 'content', 'model', 'stop_reason', 'stop_sequence', 'usage']
        '''
        parameter = self.model_kwargs.copy()
      
        content = []
        if question:
            content.append({
                'type': 'text',
                'text': question,
            })

        if imgUrl:
            content.append({
                'type': 'image',
                'source': {
                    'type': 'base64',
                    'media_type': 'image/jpeg',
                    'data': encode_image_base64(imgUrl),
                }
            })

        if system:
            parameter['system'] = system
        
        parameter.update({
            'messages': [{
                'role': 'user',
                'content': content
            }]
        })

        try:
            response = self.bedrock.invoke_model(
                body=json.dumps(parameter),
                modelId=self.modelId,
                accept='application/json',
                contentType='application/json'
            )
            return json.loads(response.get('body').read())
            # return response_body.get('content')[0]['text']
        except Exception as e:
            logger.error(e)
            return None


    '''
    Bedrock API: invoke LLM model stream
    Reference: https://docs.aws.amazon.com/bedrock/latest/userguide/inference-invoke.html
    '''
    async def invoke_llm_stream(self, question: str):
        try:
            response = self.bedrock.invoke_model_with_response_stream(
                #FIXME: anthropic.claude-3-sonnet-20240229-v1:0
                modelId='anthropic.claude-v2:1', 
                body= json.dumps({
                    'prompt': f'\n\nHuman: {question}\n\nAssistant:',
                    'max_tokens_to_sample': 4000,
                })
            )

            stream = response.get('body')
            if stream:
                for event in stream:
                    chunk = event.get('chunk')
                    if chunk:
                        yield json.loads(chunk.get('bytes').decode())['completion']
        except Exception as e:
            logger.error(e)
            return

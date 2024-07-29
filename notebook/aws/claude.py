import boto3
import json
from botocore.config import Config

from langchain_aws.chat_models import ChatBedrock
from langchain.callbacks import StdOutCallbackHandler

from config import config
from utils import encode_image_base64


class BedrockClaude():
    def __init__(self):
        self.region = config.BEDROCK_REGION
        self.modelId = config.LLM_MODEL_ID
        self.bedrock = boto3.client(
            service_name = 'bedrock-runtime',
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
            'max_tokens': 4096, # max tokens
            'temperature': 0.1, # [0, 1]
            'top_p': 0.9, # [0, 1]
            'top_k': 250, # [0, 500]
            'stop_sequences': ['Human:', 'H: ']
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
    https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html
    '''    
    def invoke_llm(self, text: str, image: str = None, imgUrl: str = None, system: str = None):
        '''
        Returns:
            dict: ['id', 'type', 'role', 'content', 'model', 'stop_reason', 'stop_sequence', 'usage']
        '''
        parameter = self.model_kwargs.copy()
      
        content = []
        # text
        if text:
            content.append({
                'type': 'text',
                'text': text,
            })
        
        # image
        if imgUrl:
            image = encode_image_base64(img_url=imgUrl)
        if image:
            content.append({
                'type': 'image',
                'source': {
                    'type': 'base64',
                    'media_type': 'image/jpeg',
                    'data': image,
                }
            })

        # system
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
        except Exception as e:
            print(e)
            return None
        
    def invoke_llm_response(self, text: str, image: str = None, imgUrl: str = None, system: str = None):
        return self.invoke_llm(
            text=text, image=image, imgUrl=imgUrl, system=system).get('content', [])[0].get('text', '')


    '''
    Bedrock API: invoke LLM model stream
    https://docs.aws.amazon.com/bedrock/latest/userguide/inference-invoke.html
    '''
    async def invoke_llm_stream(self, text: str):
        try:
            response = self.bedrock.invoke_model_with_response_stream(
                #FIXME: anthropic.claude-3-sonnet-20240229-v1:0
                modelId='anthropic.claude-v2:1', 
                body= json.dumps({
                    'prompt': f'\n\nHuman: {text}\n\nAssistant:',
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
            print(e)
            return

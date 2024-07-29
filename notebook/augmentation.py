import json
from langchain.prompts import PromptTemplate

from aws.claude import BedrockClaude
from aws.embedding import BedrockEmbedding


class Augmentation():
    def __init__(self):
        self.llm = BedrockClaude()
        self.embedding = BedrockEmbedding()


    # generate name in korean, description, tags as a JSON object
    def gen_properties(self, item: dict):
        template = PromptTemplate(
                    template="""
                        Look at the image and properties of this product and describe it in Korean.
                        Format the response as a JSON object with four keys: "namekor", "summary", "image_summary" and "tags".
                        - "namekor": Name of product in Korean
                        - "summary": Summary of product form based on appearance in a sentence
                        - "image_summary": Describe this image of product based on its type, color, material, pattern, and features.
                        - "tags": An array of strings representing key features or properties that can represent color, pattern, material, type of the product.
                        
                        Here are the properties of the product:
                        <product>
                        {product}
                        </product>
                        """,
                    input_variables=['product']
                )
        
        res = self.llm.invoke_llm_response(text=template.format(product=str(item)), imgUrl=item['thumbnail'])
        try:
            j = json.loads(str(res))
            return {
                'namekor': j.get('namekor', ''),
                'summary': j.get('summary', ''),
                'image_summary': j.get('image_summary', ''),
                'tags': j.get('tags', '')
            }
        except Exception as e:
            print(e)
            return {}
    

    # generate description in Korean by json data of item
    def gen_description(self, item: dict):
        try:
            res = self.llm.invoke_llm_response(text=PromptTemplate(
                template="""
                    look at the image of the product and properties and write a detailed and narrative product description in Korean.
                    Keep a lively tone and use a hook to make users want to buy the product.
                    Do not include tags or other descriptions.

                    Here are the properties of the product:
                    <product>
                    {product}
                    </product>
                    """,
                input_variables=['product']
            ).format(product=str(item)), imgUrl=item['thumbnail'])
            return res
        except Exception as e:
            print(e)
            return None


    # generate description about image
    def describe_image(self, image: str = None, imgUrl: str = None):
        res = self.llm.invoke_llm_response(
            text="Describe fashion items such as clothing and accessories in Korean. Don't describe people.",
            image=image,
            imgUrl=imgUrl
        )
        return res
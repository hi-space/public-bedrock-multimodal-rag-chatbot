from typing import List
from langchain.prompts import (
    PromptTemplate,
)
from langchain.schema import (
    HumanMessage,
    SystemMessage,
    Document,
)


FASHION_PROMPT_TEMPLATE = """
Human would like to find fashion products, and you recommend fashion products that users want through conversations and question using only information from the search results.
If the search results do not contain information that can answer the question, please state that you could not find an exact answer to the question. Always answer in Korean.

Here are the instructions:
<instruction>
1. Analyze the user's query to understand the context and required information.
2. Generate a detailed and accurate response based on the search results.
3. For each sentence in your answer, explain why you recommend the product. Use the format [[id]]#[[name]]#[[thumbnail URL]] only if the product id and thumbnail URL information is accurate; otherwise, write in natural sentences.
4. Ensure the response is matches the format in step 3
</instruction>

Here are the conversation between an Assistant and a Human:
<conversations>
{conversations}
</conversations>

Here are the search results:
<search>
{search}
</search>

Here is a question from Human:
<question>
{question}
</question>
"""


FASHION_SIMPLE_PROMPT_TEMPLATE = """
Human would like to find fashion products, and you recommend fashion products that users want through conversations and question.
Always answer in Korean.

Here are the conversation between an Assistant and a Human:
<conversations>
{conversations}
</conversations>

Here is a question from Human:
<question>
{question}
</question>
"""


def get_prompt(text: str = None, image: str = None, conversations = None, context: List[Document] = None):
    content = []

    if image:
        content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/webp;base64,{image}",
            },
        })

    if not text or text == 'Human:':
        text = 'Recommend some fashion products.'
    
    if context != None:
        text = PromptTemplate(
                template=FASHION_PROMPT_TEMPLATE,
                input_variables=["question", "conversations", "search"]
            ).format(question=text, conversations = conversations, search=context)
    else:
        text = PromptTemplate(
                template=FASHION_SIMPLE_PROMPT_TEMPLATE,
                input_variables=["question", "conversations"]
            ).format(question=text, conversations = conversations)

    content.append({
        "type": "text",
        "text": text
    })

    messages = [
        SystemMessage(content="You are an assistant who recommends appropriate fashion products based on the human's questions."),
        HumanMessage(
            content=content
        )
    ]

    return messages

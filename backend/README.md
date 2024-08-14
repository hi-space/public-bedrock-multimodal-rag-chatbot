# Multimodal Chatbot Backend

This project is a FastAPI-based server application that support for a Multimodal RAG chatbot. The server handles various operations including multimodal and text-based queries, embeddings, and facilitates continuous conversations with Amazon Bedrock.

## Features

- Item retrieval from DynamoDB and provision via API
- Chat history storage using Redis
- Asynchronous chat content generation and SSE transmission
- Support Knowledge bases for Amazon Bedrock
- OpenSearch Hybrid Search
- Multimodal Embedding, Multimodal LLM

## Getting Started

### Requirements

This project uses Amazon Bedrock and Amazon OpenSearch Service. The necessary infrastructure should be set up in your AWS account, and the related information should be entered in the `.env` file.

- Create a `.env` file in the root directory and fill in the contents.
- Ensure that the `.env` file is properly configured with your AWS credentials and other necessary settings.

Python dependency modules can be installed with the following command:

```sh
pip install -r requirements.txt
```

### How to Run

```sh
uvicorn main:app --reload --host=0.0.0.0 --port=8000
```

### Docker Support

```sh
docker-compose up
```

## API Documents

After the server is running, you can check the API documentation at:

- Swagger: `/docs`
- ReDoc: `/redoc`

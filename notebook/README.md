# Multimodal RAG

## Requirements

1. [데이터셋](https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-dataset) 준비
   - 데이터 augmentation 없이, 생성되어 있는 [샘플 데이터](../data/product.csv)로 테스트 할 경우 skip 가능
2. Bedrock에서 사용할 Model access
3. OpenSearch Service 도메인 생성
4. DynamoDB 테이블 생성
5. `.env` 파일에 값 설정

## Notebooks

1. [데이터 Augmentation](./1-augment-dataset.ipynb)
   - JSON 파일로부터 상품을 관리하기 위한 추가적인 메타데이터(한글 상품명, 상품 요약, 이미지 설명글, 태그)와 상품 소개글을 생성합니다.
   - 생성된 데이터는 csv로 저장하고, csv 파일을 로드해서 DynamoDB에 저장합니다.

| Before Augmentation                 | After Augmentation                |
|-------------------------------------|-----------------------------------|
| ![Before](../assets/before-aug.png) | ![After](../assets/after-aug.png) |

2. [VectorDB에 Embedding한 값 저장](./2-embedding.ipynb)

```mermaid
graph LR
    A[\image\]:::imageStyle
    B[\image + name_kor\]:::imageStyle
    C[\text summary\]:::descStyle
    D[\description\]:::descStyle
    E[\image summary\]:::descStyle
    
    A --> F[[Multimodal Embedding]]:::multiEmbeddingStyle
    B --> F[[Multimodal Embedding]]:::multiEmbeddingStyle
    C --> G[[Text Embedding]]:::textEmbeddingStyle
    D --> G[[Text Embedding]]:::textEmbeddingStyle
    E -->G[[Text Embedding]]:::multiEmbeddingStyle

    F --> H[(product-image)]:::outputStyle
    G --> I[(product-text)]:::outputStyle

    classDef imageStyle fill:#B090F3,stroke:#E6E6FA,stroke-width:2px,color:#000000;
    classDef descStyle fill:#87CAF0,stroke:#E6E6FA,stroke-width:2px,color:#000000;
    classDef multiEmbeddingStyle fill:#FFA500,stroke:#F08D2B,stroke-width:2px,color:#000000;
    classDef textEmbeddingStyle fill:#FFE451,stroke:#F08D2B,stroke-width:2px,color:#000000;
    classDef outputStyle fill:#F08D2B,stroke:#FFFFFF,stroke-width:2px,color:#000000;
```

3. [Vector Search 테스트](./3-vector-search.ipynb)

- Multimodal Embedding, Text Embedding 별로 쿼리에 따른 검색 결과를 확인합니다.
- Query를 항상 Multimodal Embedding

```mermaid
graph LR
    A[\image\]:::imageStyle
    E[\text\]:::descStyle

    A --> F[[Multimodal Embedding]]:::multiEmbeddingStyle
    E --> F[[Multimodal Embedding]]:::multiEmbeddingStyle

    F --> H[(product-image)]:::outputStyle
    
    classDef imageStyle fill:#B090F3,stroke:#E6E6FA,stroke-width:2px,color:#000000;
    classDef descStyle fill:#87CAF0,stroke:#E6E6FA,stroke-width:2px,color:#000000;
    classDef multiEmbeddingStyle fill:#FFA500,stroke:#F08D2B,stroke-width:2px,color:#000000;
    classDef outputStyle fill:#F08D2B,stroke:#FFFFFF,stroke-width:2px,color:#000000;
```

- Query를 항상 Text Embedding

```mermaid
graph LR
    A[/image/]:::imageStyle
    E[/text/]:::descStyle

    A --> F([Multimodal LLM]):::llmStyle
    F --> G[[Text Embedding]]:::multiEmbeddingStyle
    E --> G[[Text Embedding]]:::textEmbeddingStyle

    G --> I[(product-text)]:::outputStyle

    classDef imageStyle fill:#B090F3,stroke:#E6E6FA,stroke-width:2px,color:#000000;
    classDef descStyle fill:#87CAF0,stroke:#E6E6FA,stroke-width:2px,color:#000000;
    classDef llmStyle fill:#FFABAB,stroke:#E6E6FA,stroke-width:2px,color:#000000;
    classDef textEmbeddingStyle fill:#FFE451,stroke:#F08D2B,stroke-width:2px,color:#000000;
    classDef outputStyle fill:#F08D2B,stroke:#FFFFFF,stroke-width:2px,color:#000000;
```

- Query가 텍스트인 경우 Text Embedding, 이미지를 포함한 경우 Multimodal Embedding

```mermaid
graph LR
    A[\image\]:::imageStyle
    E[\text\]:::descStyle

    A --> F[[Multimodal Embedding]]:::multiEmbeddingStyle
    E --> F[[Multimodal Embedding]]:::multiEmbeddingStyle

    F --> H[(product-image)]:::outputStyle
    
    classDef imageStyle fill:#B090F3,stroke:#E6E6FA,stroke-width:2px,color:#000000;
    classDef descStyle fill:#87CAF0,stroke:#E6E6FA,stroke-width:2px,color:#000000;
    classDef multiEmbeddingStyle fill:#FFA500,stroke:#F08D2B,stroke-width:2px,color:#000000;
    classDef outputStyle fill:#F08D2B,stroke:#FFFFFF,stroke-width:2px,color:#000000;
```

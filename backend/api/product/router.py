from fastapi import APIRouter, status
from api.product.repository import ProductDB


router = APIRouter(
    prefix="/product",
    tags=["product"],
    responses={
        status.HTTP_200_OK: {
            "description": "Successed",
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Not Found",
        },
    },
)


@router.get("/")
async def get_products(query: str='', key: str='', pageSize: int=50):
    return ProductDB().get_items(key=key, page_size=pageSize, query=query)


@router.delete('/{id}')
async def remove_product_item(id):
    return ProductDB().remove_item(id)


@router.get('/{id}')
async def get_product_item(id):
    return ProductDB().get_item_by_id(id)

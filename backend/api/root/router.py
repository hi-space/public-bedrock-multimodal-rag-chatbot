from fastapi import APIRouter, status

router = APIRouter(
    prefix="",
    tags=["root"],
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
def main():
    return {"message": "Hello World"}


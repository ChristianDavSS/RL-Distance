from pydantic import BaseModel

class PathRequest(BaseModel):
    data: list[dict]
    source: str
    dest: str
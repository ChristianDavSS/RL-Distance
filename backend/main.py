from fastapi import FastAPI
from domain.graph import Graph
from domain.rl_model import RLModel

app = FastAPI()

@app.get("/")
def get_path(data: list[dict], source: str, dest: str) -> list[str]:
    """
    GET Endpoint: Receives the whole data the user created and
    manages to apply the RL algorithm
    """
    # get the nodes and edges
    # data = [
    #     {"data": {"id": "a"}},
    #     {"data": {"id": "b"}},
    #     {"data": {"id": "c"}},
    #     {"data": {"source": "a", "target": "b"}},
    #     {"data": {"source": "b", "target": "c"}},
    #     {"data": {"source": "c", "target": "a"}}
    # ]
    # Instanciate the model
    model = RLModel(Graph(data, source, dest))
    
    # Return the execution of the algorithm
    return model.execute()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from domain.graph import Graph
from domain.rl_model import RLModel
from domain.models import PathRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/")
def get_path(request: PathRequest) -> list[str]:
    """
    GET Endpoint: Receives the whole data the user created and
    manages to apply the RL algorithm
    """
    # Instanciate the model
    model = RLModel(Graph(request.data, request.source, request.dest))
    
    # Return the execution of the algorithm
    return model.execute()
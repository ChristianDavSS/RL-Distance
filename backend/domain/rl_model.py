from domain.graph import Graph
import numpy as np
import random

class RLModel:
    def __init__(self, graph: Graph, alpha:float = 0.9, gamma:float = 0.75):
        self.graph = graph
        self.alpha = alpha
        self.gamma = gamma
        self.startIdx = self.graph.nodes.index(self.graph.source)
        self.targetIdx = self.graph.nodes.index(self.graph.dest)
        
        
    def __set_dest_row(self, matrix: list[list[int]]) -> np.ndarray:
        matrix = np.array(matrix)
        
        matrix[self.targetIdx, np.array(matrix[self.targetIdx]).argmax()] = 100
        
        return matrix
    
    
    def __execute_algorithm(self, R: np.ndarray, Q: np.ndarray):
        shape = Q.shape
        current_state = self.startIdx
        
        # iterate over (epochs)
        for i in range(2000):
            # get a random current state
            available_actions = list()
            # get the possible actions in that state
            for j in range(shape[1]):
                # if the current position is > 0, it's an action
                if R[current_state, j] > 0:
                    available_actions.append(j)
            
            current_action = random.choice(available_actions)
            next_state = current_action
            TD = R[current_state, current_action] + (self.gamma * Q[next_state, np.argmax(Q[next_state,])]) - Q[current_state, current_action]
            Q[current_state, current_action] = Q[current_state, current_action] + self.alpha*TD

            current_state = current_action
            
    
    def __get_path(self, Q: np.ndarray) -> list[str]:
        path = list()
        idx = self.startIdx
        
        while idx != self.targetIdx:
            path.append(self.graph.nodes[idx])
            idx = Q[idx].argmax()

        return path
    
    def execute(self) -> list[str]:
        # create the rewards matrix
        R = self.graph._create_rewards_matrix()
        # set the targeted row in the rewards matrix
        R = self.__set_dest_row(R)
        # Define the Q matrix (result)
        Q = np.array(np.zeros([len(R), len(R)]))
        # Execute the algorithm
        self.__execute_algorithm(R, Q)
        
        return self.__get_path(Q)
    
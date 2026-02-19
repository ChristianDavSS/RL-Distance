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
        # from vanilla matrix to np matrix
        matrix = np.array(matrix)
        
        # set the highest reward on the row of the desired state
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
            
            # choice a random action from the available actions
            current_action = random.choice(available_actions)
            # the next state is the current action index
            next_state = current_action
            # apply the formulas of TD
            TD = R[current_state, current_action] + (self.gamma * Q[next_state, np.argmax(Q[next_state,])]) - Q[current_state, current_action]
            Q[current_state, current_action] = Q[current_state, current_action] + self.alpha*TD

            # update the current state index
            current_state = current_action
            
    
    def __get_path(self, Q: np.ndarray, edges: dict[str, str]) -> list[str]:
        # set a starting index
        idx = self.startIdx
        # list to save the path nodes
        path: list[str] = list()
        
        # while the current idx isn't the same as the target
        while idx != self.targetIdx:
            # if the current node is already in the path, we're on a loop... :(
            if self.graph.nodes[idx] in path:
                return []
            
            # append the current node to the path and get the index of the next state
            path.append(self.graph.nodes[idx])
            idx = Q[idx].argmax()
            
        path = path + [self.graph.nodes[idx]]
            
        # Loop through the path list and append the ID of the edges
        for i in range(1, len(path)):
            max_value, min_value = max(path[i], path[i-1]), min(path[i], path[i-1])
            path.append(edges.get(f"{min_value}{max_value}"))

        # return the path
        return path
    
    def execute(self) -> list[str]:
        # create the rewards matrix
        R, edges = self.graph._create_rewards_matrix()
        # set the targeted row in the rewards matrix
        R = self.__set_dest_row(R)
        # Define the Q matrix (result)
        Q = np.array(np.zeros([len(R), len(R)]))
        # Execute the algorithm
        self.__execute_algorithm(R, Q)
        
        return self.__get_path(Q, edges)
    
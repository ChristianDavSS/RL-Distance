class Graph:
    def __init__(self, data: list[dict], source: str, dest: str):
        nodes, edges = self.clean_data(data)
        
        self.nodes: list[str] = sorted(nodes)
        self.edges: list[dict] = edges
        self.source = source.lower().strip()
        self.dest = dest.lower().strip()
        
        
    def clean_data(self, data: list[dict]) -> tuple[list[str], list[dict]]:
        """
        clean_data method: gets the uncleaned data and divides it in two
        categories -> nodes and edges
        """
        # List to save the node names
        nodes: list[str] = list()
        # List to save the dicts of the edges
        edges: list[dict] = list()
        
        # Iterate over the data to fill up the nodes and edges
        for value in data:
            value = value.get("data")
            # if the dict doesn't contains a key 'id' we set -1 as a value
            node = value.get("id", -1)
            if node != -1:
                nodes.append(node)
            else:
                edges.append(value)
                
        return nodes, edges
                
                
    def _create_matrix(self) -> list[list[int]]:
        """
        Creates the empty matrix based on the nodes dimentions
        
        :param nodes: Description
        :type nodes: list[str]
        """
        n = len(self.nodes)
        return [[0] * n for _ in range(n)]
    
    
    def _create_rewards_matrix(self) -> list[list[int]]:
        """
        Creates the rewards matrix based on the nodes indexes
        
        :param empty_matrix: Matrix full of 0's
        :type empty_matrix: list[list[int]]
        """
        matrix = self._create_matrix()
        
        for subdict in self.edges:
            key, value = subdict.get("source"), subdict.get("target")
            matrix[self.nodes.index(key)][self.nodes.index(value)] = 1
        
        return matrix
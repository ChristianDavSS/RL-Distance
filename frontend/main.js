import cytoscape from "cytoscape"
import axios from "axios";

var cy = cytoscape({
  container: document.getElementById("cy"),

  elements: [
    // Nodos
    { group: "nodes", data: { id: "a", label: "a" } },
    { group: "nodes", data: { id: "b", label: "b" } },
    { group: "nodes", data: { id: "c", label: "c" } },

    // Aristas
    { group: "edges", data: { source: "a", target: "b" } },
    { group: "edges", data: { source: "b", target: "c" } },
    { group: "edges", data: { source: "c", target: "a" } },
  ],

  style: [
    {
      selector: "node",
      style: {
        "background-color": "#0074D9",
        label: "data(id)",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#aaa",
      },
    },
  ],

  layout: {
    name: "grid",
  },
});

const extractElements = async () => {
  /*
  * extractElement arrow function used to extract the elements
  * from the graph
  */
  let elements = []
  let raw_elements = cy.elements()
  raw_elements.forEach(e => {
    elements.push(e._private.data)
  })

  let r = await axios.post("http://127.0.0.1:8000/", {data: elements, source: "a", dest: "f"})
  console.log(r)
}

document.getElementById("hey").addEventListener("click", () => {
  extractElements();
})

// define a initial queue
let queue = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
// define a set of the starter words
let added = ["a", "b", "c"];
// remove the starter words from the queue
queue = queue.filter(e => !added.includes(e))
// add the starter works modified to the end of the queue
  queue.push(...added.map(e => e + e[0]))

document.getElementById("add-node-btn").addEventListener("click", () => {
  // add the first element to the 'added' array
  added.push(queue[0])

  // get and remove the first element from the queue
  let e = queue.shift()
  // set the removed element to the queue
  queue.push(e + e[0])

  // add the node in the 'added' array
  cy.add({
    group: "nodes",
    data: {
      id: `${added[added.length - 1]}`,
      label: `${added[added.length - 1]}`,
    },
  });
});

let toConnect = [];

cy.on("tap", "node", (e) => {
  const node = e.target;
  //Adds the index of the existing node to a global array
  toConnect.push(added.indexOf(node.data("id")));

  //If there are two elements in the array an attempt is made to add a edge
  if (toConnect.length === 2) {
    //Sorts the array
    if (toConnect[0] > toConnect[1]) {
      var copy = toConnect[0];
      toConnect[0] = toConnect[1];
      toConnect[1] = copy;
    }

    let isConnection = cy.edges(
      `[source = "${added[toConnect[0]]}"][ target = "${added[toConnect[1]]}"]`,
    );
    // if the edge does not exist the it is added
    if (isConnection.length <= 0) {
      cy.add({
        group: "edges",
        data: { source: added[toConnect[0]], target: added[toConnect[1]] },
      });
      toConnect = [];
    } else {
      console.log("Ya existe esa conecxion");
      toConnect = [];
    }
  }
});

cy.on("tap", "edge", (e) => {
  const clickeado = e.target;
  cy.remove(clickeado);
});

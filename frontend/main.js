//import cytoscape from "cytoscape";

var cy = cytoscape({
  container: document.getElementById("cy"),

  elements: [
    // Nodos
    { group: "nodes", data: { id: "a", label: "A" } },
    { group: "nodes", data: { id: "b", label: "B" } },
    { group: "nodes", data: { id: "c", label: "C" } },

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

let labels = ["a", "b", "c", "d", "e", "f", "g"];
let added = ["a", "b", "c"];

document.getElementById("add-node-btn").addEventListener("click", () => {
  //while (true) {
  let newNode;
  let level = 0;
  let lastNode = added[added.length - 1];

  while (true) {
    // index of the letter of the last addedNode
    let letterLast = labels.findIndex((element) => element === lastNode[level]);

    // if new labels run out and there is no next lebel in the last node (str.length)
    if (letterLast === labels.length - 1 && level + 1 >= lastNode.length) {
      level += 1;
      let toAdd = "";
      for (let i = 0; i <= level; i++) {
        toAdd += "a";
      }
      added.push(toAdd);
      break;

      //if labels run out but there are more letters in the last node
    } else if (letterLast === labels.length - 1) {
      lastNode = lastNode.split("");
      lastNode[level] = "a";
      lastNode = lastNode.join("");
      level += 1;
    } else {
      newNode = lastNode.split("");
      newNode[level] = labels[letterLast + 1];
      added.push(newNode.join(""));
      break;
    }
  }

  cy.add({
    group: "nodes",
    data: {
      id: `${added[added.length - 1]}`,
      label: `${added[added.length - 1]}`,
    },
  });

  //console.log(labels.findIndex((element) => element === ultimo));

  console.log("agregado", added);
  //}
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

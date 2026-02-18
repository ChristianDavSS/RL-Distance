import cytoscape from "cytoscape"

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


const originSelect = document.getElementById("state-select");
const destSelect = document.getElementById("action-select");

// updates the dropdown options based on the current nodes in the graph.
function updateSelectOptions() {
  const nodes = cy.nodes();
  const currentOrigin = originSelect.value;
  const currentDest = destSelect.value;

  originSelect.innerHTML = '<option value="" disabled selected>Selecciona un estado origen</option>';
  destSelect.innerHTML = '<option value="" disabled selected>Selecciona un estado destino</option>';

  nodes.forEach((node) => {
    const id = node.id();
    
    // origin select
    const optOrigin = document.createElement("option");
    optOrigin.value = id;
    optOrigin.innerText = `Nodo ${id.toUpperCase()}`;
    originSelect.appendChild(optOrigin);

    // destination select
    const optDest = document.createElement("option");
    optDest.value = id;
    optDest.innerText = `Ir a Nodo ${id.toUpperCase()}`;
    destSelect.appendChild(optDest);
  });

  if (currentOrigin) originSelect.value = currentOrigin;
  if (currentDest) destSelect.value = currentDest;

  validateSelection();
}

 // validates origen and destino are not the same.

function validateSelection() {
  const selectedOrigin = originSelect.value;

  Array.from(destSelect.options).forEach((option) => {
    if (option.disabled && option.value === "") return;

    if (option.value === selectedOrigin) {
      option.disabled = true;
      option.innerText = `(No puedes seleccionar el mismo nodo)`;
      if (destSelect.value === selectedOrigin) {
        destSelect.value = "";
      }
    } else {
      option.disabled = false;
      option.innerText = `Ir a Nodo ${option.value.toUpperCase()}`;
    }
  });
}

originSelect.addEventListener("change", validateSelection);

updateSelectOptions();



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

  // we calculate center of the current viewport to place the new node within view
  const pan = cy.pan();
  const zoom = cy.zoom();
  const w = cy.width();
  const h = cy.height();
  
  // convert screen center to model coordinates
  const modelX = (w / 2 - pan.x) / zoom;
  const modelY = (h / 2 - pan.y) / zoom;


  cy.add({
    group: "nodes",
    data: {
      id: `${added[added.length - 1]}`,
      label: `${added[added.length - 1]}`,
    },
    position: { x: modelX, y: modelY }
  }); updateSelectOptions();

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
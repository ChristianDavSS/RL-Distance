var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import cytoscape from "cytoscape";
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
const extractElements = (source, dest) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /*
     * extractElement arrow function used to extract the elements
     * from the graph
     */
    let elements = [];
    let raw_elements = cy.elements();
    raw_elements.forEach((e) => {
      elements.push(e.data());
    });
    let { data } = yield axios.post("http://127.0.0.1:8000/", {
      data: elements,
      source: source,
      dest: dest,
    });

    return data;
  });
const originSelect = document.getElementById("state-select");
const destSelect = document.getElementById("action-select");
const resetToDefault = () => {
  added.forEach((e) => {
    cy.$id(e).style("background-color", "#0074D9");
  });
  cy.edges().forEach((e) => {
    let id = e.data().id;
    cy.$id(id).style("line-color", "#aaa");
  });
};

var errorMessage = document.getElementById("Message");
var errorInfo = document.getElementById("info");
function showErrorMessage(info) {
  errorMessage.classList.remove("opacity-transition");
  errorMessage.classList.remove("no-display");
  errorInfo.innerText = info;
}

destSelect.addEventListener("change", () =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (originSelect.value == "") {
      showErrorMessage("Añade un origen primero");
      destSelect.value = "";
      return;
    }
    let data = yield extractElements(originSelect.value, destSelect.value);
    resetToDefault();
    if (data.length === 0) {
      showErrorMessage("No se encontro ruta para los nodos");
    }
    data.forEach((e) => {
      cy.$id(e).style("background-color", "red").style("line-color", "red");
    });
  }),
);
// updates the dropdown options based on the current nodes in the graph.
function updateSelectOptions() {
  const nodes = cy.nodes();
  const currentOrigin = originSelect.value;
  const currentDest = destSelect.value;
  originSelect.innerHTML =
    '<option value="" disabled selected>Selecciona un estado origen</option>';
  destSelect.innerHTML =
    '<option value="" disabled selected>Selecciona un estado destino</option>';
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
// define a initial queue
let queue = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
// define a set of the starter words
let added = ["a", "b", "c"];
// remove the starter words from the queue
queue = queue.filter((e) => !added.includes(e));
// add the starter works modified to the end of the queue
queue.push(...added.map((e) => e + e[0]));
var addNodeButton = document.getElementById("add-node-btn");
addNodeButton.addEventListener("click", () => {
  // add the first element to the 'added' array
  added.push(queue[0]);
  // get and remove the first element from the queue
  let e = queue.shift();
  if (e) {
    queue.push(e + e[0]);
  }
  // set the removed element to the queue
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
    position: { x: modelX, y: modelY },
  });
  updateSelectOptions();
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

function quitMessage() {
  errorMessage.classList.add("opacity-transition");
  setTimeout(() => {
    errorMessage.classList.add("no-display");
  }, 500);
}
var messageX = document.querySelector(".quitBtn");
var messageAccept = document.querySelector(".acceptBtn");
messageX.addEventListener("click", () => {
  quitMessage();
});
messageAccept.addEventListener("click", () => {
  quitMessage();
});
var nodesNumber = document.getElementById("nodes-number");
nodesNumber.addEventListener("change", () => {
  var addButton = document.getElementById("add-node-btn");
  if (nodesNumber.value === "1") {
    addButton.innerText = "+ Agregar Nodo";
  } else {
    addButton.innerText = "+ Agregar Nodos";
  }
});

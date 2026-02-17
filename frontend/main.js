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

cy.on("tap", "node", function (evt) {
  const node = evt.target;

  alert(`Click en ${node.data("label")}\nInfo: ${node.data("info")}`);
});

labels = ["a", "b", "c", "d", "e", "f", "g"];
added = ["a", "b", "c"];

document.getElementById("hola").addEventListener("click", () => {
  //while (true) {
  let nuevo;
  let nivel = 0;
  let anterior = added[added.length - 1];

  while (true) {
    let otro = labels.findIndex((element) => element === anterior[nivel]);
    //console.log(otro, "prueba");
    if (otro === labels.length - 1 && nivel + 1 >= anterior.length) {
      nivel += 1;
      //Para añadir un nuevo nivel
      if (anterior.length <= nivel + 1) {
        aAgrgar = "";
        for (let i = 0; i <= nivel; i++) {
          aAgrgar += "a";
        }
        //console.log("QUEEEEE", aAgrgar);
        added.push(aAgrgar);
        break;
      }
    } else if (otro === labels.length - 1) {
      anterior = anterior.split("");
      anterior[nivel] = "a";
      anterior = anterior.join("");
      nivel += 1;
    } else {
      nuevo = anterior.split("");
      nuevo[nivel] = labels[otro + 1];
      added.push(nuevo.join(""));
      break;
      //console.log("COMO", labels[otro + 1]);
      //console.log(nuevo, "sAHUR");
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

  //cy.add([{}]);
});

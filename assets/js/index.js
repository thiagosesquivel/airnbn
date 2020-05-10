let data;
let types = [];

const places = document.querySelector("#places");
const typeSearch = document.querySelector("#type-search");
const searchInputs = document.querySelector("#filters");
const orderInput = document.querySelector("#order");

function criarCard(d, elementoPai) {
  const elemento = this.document.createElement("div");
  elemento.classList.add("card", "col-4", "col-6", "col");
  const formated = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(d.price);
  const template = ` 
  <img src="${d.photo}" alt="" class="card-image" />
  <div class="card-body">
    <div class="card-description">
    <label>${d.property_type}</label>
      <h3>${d.name}</h3>
      <b><label>Preço: ${formated}</label></b>
    </div>
  </div>
`;
  elemento.innerHTML = template;
  elementoPai.appendChild(elemento);
}

function extraiTypes(array, data) {
  array.push(data.property_type);
}

function removeRepetidos(data) {
  const novoArray = [...new Set(data)];
  return novoArray;
}

function filterBy(event, data, places) {
  const alvo = event.target;
  places.classList.add("animate__fadeOut");
  places.innerHTML = "";
  places.classList.remove("animate__fadeOut");
  places.classList.add("animate__fadeIn");

  alvo.value === "" ? data.map((d) => criarCard(d, places)) : null;

  data.map((d) => {
    d.property_type == alvo.value ? criarCard(d, places) : null;
  });
}

function orderBy(event, data, places) {
  const alvo = event.target;
  places.classList.add("animate__fadeOut");
  places.innerHTML = "";
  places.classList.remove("animate__fadeOut");
  places.classList.add("animate__fadeIn");
  if (alvo.value === "menor") {
    let arr = data.sort(function (a, b) {
      return a.price > b.price ? 1 : b.price > a.price ? -1 : 0;
    });
    arr.map((a) => criarCard(a, places));
  } else {
    let arr = data.sort(function (a, b) {
      return a.price < b.price ? 1 : b.price < a.price ? -1 : 0;
    });
    arr.map((a) => criarCard(a, places));
  }
}

function toggleFilter() {
  searchInputs.classList.contains("inputs-show")
    ? (function () {
        searchInputs.classList.remove("inputs-show", "animate__fadeInDown");
        searchInputs.classList.add("animate_fadeOutUp");
      })()
    : searchInputs.classList.add("inputs-show", "animate__fadeInDown");
}

function orderAsc(a, b) {
  return a.price > b.price ? 1 : b.price > a.price ? -1 : 0;
}

function orderDec(a, b) {
  return a.price < b.price ? 1 : b.price < a.price ? -1 : 0;
}

window.onload = async function () {
  data = await fetch(
    "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72"
  ).then((response) => response.json());

  data.map((d) => {
    criarCard(d, places);
    extraiTypes(types, d);
  });

  types = removeRepetidos(types);
  types.forEach((t) => {
    const option = document.createElement("option");
    option.value = t;
    option.innerHTML = t;
    typeSearch.appendChild(option);
  });

  typeSearch.addEventListener("change", () => filterBy(event, data, places));
  orderInput.addEventListener("change", () => orderBy(event, data, places));
};

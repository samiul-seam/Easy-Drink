const loadRandomDrinks = () => {
  const container = document.getElementById("drinksContainer");
  container.innerHTML = ""; // clear previous

  for (let i = 0; i < 12; i++) {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then((res) => res.json())
      .then((data) => {
        displayCard(data.drinks[0]);
      });
  }
};

const displayCard = (drink) => {
  const container = document.getElementById("drinksContainer");

  const div = document.createElement("div");
  div.classList.add("card", "mb-3");
  div.style.width = "18rem";
  div.innerHTML = `
    <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${drink.strDrink}" />
    <div class="card-body">
      <h5 class="card-title">${drink.strDrink}</h5>
      <p class="card-text">Category: ${drink.strCategory}</p>
      <p class="card-text">Instructions: ${drink.strInstructions.slice(0, 15)}...</p>
      <button onclick="addToGroup('${drink.strDrink}')" class="btn btn-success me-2">Add to Group</button>
      <button onclick="showDetails('${drink.idDrink}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#drinkModal">Details</button>
    </div>
  `;

  container.appendChild(div);
};

let selectedDrinks = [];

const addToGroup = (name) => {
  if (selectedDrinks.length >= 7) {
    alert("You cannot add more than 7 drinks!");
    return;
  }

  if (selectedDrinks.includes(name)) {
    return;
  }

  selectedDrinks.push(name);
  updateGroupList();
};

const updateGroupList = () => {
  const list = document.getElementById("groupList");
  const countSpan = document.getElementById("drinkCount");
  list.innerHTML = "";

  selectedDrinks.forEach((drink, index) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "drink-item");
    li.textContent = drink;
    li.title = "Click to remove this drink";
    li.style.cursor = "pointer";

    li.innerHTML = `
      <span>${drink}</span>
      <span class="decorative-x">  ......✖</span>
    `;

    li.addEventListener("click", () => {
      selectedDrinks.splice(index, 1);
      updateGroupList();
    });

    list.appendChild(li);
  });

  countSpan.textContent = `${selectedDrinks.length} out of 7 drinks`;
};


const showDetails = (id) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      const drink = data.drinks[0];

      const modalContent = document.getElementById("modalContent");
      modalContent.innerHTML = `
        <h5 class="deaitlsName">${drink.strDrink}</h5>
        <img src="${drink.strDrinkThumb}" class="detailsImg img-fluid mb-2" alt="${drink.strDrink}" />
        <div class = "textDetails" >
          <p><strong>Category:</strong> ${drink.strCategory}</p>
          <p><strong>Glass:</strong> ${drink.strGlass}</p>
          <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
          <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
          <p><strong>Ingredients:</strong> ${getIngredients(drink)}</p>
        </div>
      `;
    });
};

const getIngredients = (drink) => {
  let ingredients = [];
  for (let i = 1; i <= 5; i++) {
    const ing = drink[`strIngredient${i}`];
    if (ing) {
      ingredients.push(ing);
    }
  }
  return ingredients.join(", ");
};

const searchDrinks = () => {
  const input = document.getElementById("searchInput").value.trim();
  const container = document.getElementById("drinksContainer");
  container.innerHTML = "";

  if (!input) {
    loadRandomDrinks();
    return;
  }

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.drinks) {
        container.innerHTML = `<p class="textDanger">Result is not found for "${input}"</p>`;
      } else {
        data.drinks.forEach(displayCard);
      }
    });
};

document.getElementById("searchBtn").addEventListener("click", searchDrinks);

document.getElementById("searchInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchDrinks();
  }
});

window.onload = loadRandomDrinks;

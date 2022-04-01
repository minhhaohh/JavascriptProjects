const mealsElement = document.querySelector(".meals");
const favListElement = document.querySelector(".fav__list");
const searchTerm = document.querySelector(".header__input");
const searchBtn = document.querySelector(".header__search-btn");
const mealInfoContainer = document.querySelector(".meal-info-container");

getRamdomMeal();

fetchFavMeals();

async function getRamdomMeal() {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await res.json();
    const randomMeal = data.meals[0];
    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
    const data = await res.json();
    const meal = data.meals[0];

    return meal;
}

async function getMealsBySearch(term) {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);
    const data = await res.json();
    const meals = data.meals;

    return meals;
}

function addMeal(mealData, random = false) {
    const mealElement = document.createElement("div");
    mealElement.classList.add("meal");
    mealElement.innerHTML = `
        <div class="meal__header">
            ${random ? `<span class="meal__random">Random Recipe</span>` : ""}
            <img
                class="meal__img"
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
        </div>
        <div class="meal__body">
            <h4 class="meal__name">${mealData.strMeal}</h4>
            <button class="meal___fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;

    const mealIds = getMealsFromLocalStorage();
    const mealImg = mealElement.querySelector(".meal__img");
    const favBtn = mealElement.querySelector(".meal___fav-btn");

    mealIds.forEach((id) => {
        if (id === mealData.idMeal) {
            favBtn.classList.add("active");
        }
    });

    mealImg.addEventListener("click", () => {
        showMealInfo(mealData);
    });

    favBtn.addEventListener("click", () => {
        if (favBtn.classList.contains("active")) {
            removeMealLocalStorage(mealData.idMeal);
            favBtn.classList.remove("active");
        } else {
            addMealLocalStorage(mealData.idMeal);
            favBtn.classList.add("active");
        }

        fetchFavMeals();
    });

    mealsElement.appendChild(mealElement);
}

function getMealsFromLocalStorage() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

function addMealLocalStorage(mealId) {
    const mealIds = getMealsFromLocalStorage();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLocalStorage(mealId) {
    const mealIds = getMealsFromLocalStorage();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

async function fetchFavMeals() {
    favListElement.innerHTML = "";

    const mealIds = getMealsFromLocalStorage();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);
        addMealToFav(meal);
    }
}

function addMealToFav(mealData) {
    const favMealElement = document.createElement("li");
    favMealElement.classList.add("fav__item");
    favMealElement.innerHTML = `
        <img
            class="fav__img"
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <span class="fav__name">${mealData.strMeal}</span>
        <button class="fav__close-btn">
            <i class="fas fa-window-close"></i>
        </button>
    `;

    favMealElement.addEventListener("click", () => {
        showMealInfo(mealData);
    });

    const closeBtn = favMealElement.querySelector(".fav__close-btn");

    closeBtn.addEventListener("click", () => {
        removeMealLocalStorage(mealData.idMeal);
        fetchFavMeals();
    });

    favListElement.appendChild(favMealElement);
}

function showMealInfo(mealData) {
    mealInfoContainer.innerHTML = "";

    mealInfoContainer.classList.remove("hidden");

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
            ingredients.push(`${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`);
        } else {
            break;
        }
    }

    const mealInfoElement = document.createElement("div");
    mealInfoElement.classList.add("meal-info");
    mealInfoElement.innerHTML = `
            <div class="info-header">
                <button class="info-header__close-btn">
                    <i class="fas fa-times"></i>
                </button>
                <h1 class="info-header__title">${mealData.strMeal}</h1>
                <img
                    class="info-header__img"
                    src="${mealData.strMealThumb}"
                    alt="${mealData.strMeal}"
                />
            </div>
            <div class="info__content">
                <p>
                    ${mealData.strInstructions}
                </p>
                <h3>Ingredient:</h3>
                <ul>
                    ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
                </ul>
            </div>
        `;
    const mealInfoClose = mealInfoElement.querySelector(".info-header__close-btn");

    mealInfoClose.addEventListener("click", () => {
        mealInfoContainer.classList.add("hidden");
    });

    mealInfoContainer.appendChild(mealInfoElement);
}

searchBtn.addEventListener("click", async () => {
    mealsElement.innerHTML = "";

    const term = searchTerm.value;

    const meals = await getMealsBySearch(term);

    meals.forEach((meal) => {
        addMeal(meal);
    });
});

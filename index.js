const searchInput = document.querySelector("#search");
const searchButton = document.querySelector("#submit");
const resultList = document.querySelector("#results");
const loadingContainer = document.querySelector("#loading"); // Get the loading container

// When the search button is clicked
searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    searchRecipes();
});

// When Enter key is pressed in the search input
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        searchButton.click(); // Trigger the search button click event
    }
});

async function searchRecipes() {
    const searchValue = searchInput.value.trim();
    if (!searchValue) {
        alert("Please enter some ingredients!");
        return;
    }

    // Show loading spinner
    loadingContainer.style.display = "flex";

    try {
        const response = await fetch(
            `https://api.edamam.com/search?q=${searchValue}&app_id=cb6d6827&app_key=82da366fe7b1f0a9cf334ec5a117103b`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Hide loading spinner once data is fetched
        loadingContainer.style.display = "none";

        // Check if hits are returned
        if (!data.hits || data.hits.length === 0) {
            resultList.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
            return;
        }

        displayRecipes(data.hits); // Pass recipes to the display function
    } catch (error) {
        console.error("Error fetching data:", error);
        resultList.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
        loadingContainer.style.display = "none"; // Hide spinner in case of error
    }
}

function displayRecipes(recipes) {
    if (recipes.length === 0) {
        resultList.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
        return;
    }

    let html = '';
    recipes.forEach((recipe) => {
                html += `
        <div class="card">
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <h3>${recipe.recipe.label}</h3>
            <ul>
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
        </div> 
        `;
    });
    resultList.innerHTML = html;
}

// Theme toggle functionality
const themeBtn = document.getElementById("theme-btn");

// When the theme button is clicked
themeBtn.onclick = () => {
  // The default class "fa-moon" switches to "fa-sun" on toggle
  themeBtn.classList.toggle("fa-sun");
  // After the switch on toggle, if your button contains "fa-sun" class
  if (themeBtn.classList.contains("fa-sun")) {
    // Clicking themeBtn, the changeTheme styling will be applied to the body of your HTML
    document.body.classList.add("changeTheme");
  } else {
    // Clicking themeBtn, applied changeTheme styling will be removed
    document.body.classList.remove("changeTheme");
  }
};
// ====== Utility Functions ======
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// ====== Data Structures ======
let meals = loadData("meals");
let calendar = loadData("calendar");

// ====== DOM Elements ======
const mealForm = document.getElementById("meal-form");
const calendarGrid = document.getElementById("calendar-grid");
const shoppingListEl = document.getElementById("shopping-list");

// ====== Create Calendar ======
const days = Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`);
function renderCalendar() {
  calendarGrid.innerHTML = "";
  days.forEach((day, i) => {
    const div = document.createElement("div");
    div.className = "day";
    div.dataset.day = i;
    div.innerHTML = `
      <h3>${day}</h3>
      <div class="meal-slot">${
        calendar[i]
          ? `<div class="meal">
              <strong>${calendar[i].name}</strong><br>
              <em>${calendar[i].protein}</em><br>
              <a href="${calendar[i].url}" target="_blank">Recipe</a>
            </div>`
          : "<em>No meal assigned</em>"
      }</div>
      <button class="assign-btn">Assign Meal</button>
    `;
    calendarGrid.appendChild(div);
  });
}
renderCalendar();

// ====== Add Meal ======
mealForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const meal = {
    name: document.getElementById("meal-name").value.trim(),
    url: document.getElementById("meal-url").value.trim(),
    protein: document.getElementById("meal-protein").value || "Other",
    ingredients: document.getElementById("meal-ingredients").value
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean),
  };
  meals.push(meal);
  saveData("meals", meals);
  alert("Meal added!");
  mealForm.reset();
});

// ====== Assign Meal to Calendar ======
calendarGrid.addEventListener("click", (e) => {
  if (!e.target.classList.contains("assign-btn")) return;
  const dayIndex = e.target.closest(".day").dataset.day;
  const mealName = prompt(
    "Enter meal name to assign (must match one you've added):"
  );
  const meal = meals.find(
    (m) => m.name.toLowerCase() === mealName.toLowerCase()
  );
  if (!meal) return alert("Meal not found. Please add it first.");
  calendar[dayIndex] = meal;
  saveData("calendar", calendar);
  renderCalendar();
});

// ====== Generate Shopping List ======
document
  .getElementById("generate-shopping")
  .addEventListener("click", () => {
    const ingredients = calendar
      .flatMap((m) => (m && m.ingredients ? m.ingredients : []))
      .filter(Boolean);
    const unique = [...new Set(ingredients)];
    shoppingListEl.innerHTML = unique.map((i) => `<li>${i}</li>`).join("");
  });

// ====== Print Button ======
document.getElementById("print-btn").addEventListener("click", () => {
  window.print();
});

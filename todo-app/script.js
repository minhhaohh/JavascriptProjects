const form = document.querySelector(".form");
const input = document.querySelector(".input");
const todoList = document.querySelector(".todo-list");

const todosLS = JSON.parse(localStorage.getItem("todos"));

if(todosLS){
    todosLS.forEach(todoLS => {
        
    })
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const todoText = input.value;

    if (todoText) {
        const todoEl = document.createElement("li");
        todoEl.innerText = todoText;

        todoEl.addEventListener("click", () => {
            todoEl.classList.toggle("completed");
        });

        todoEl.addEventListener("contextmenu", (e) => {
            e.preventDefault();

            todoEl.remove();
        });

        todoList.appendChild(todoEl);

        input.value = "";
    }
});

function updateLS() {
    const todoTexts = document.querySelectorAll("li");

    const todoArr = [];

    todoTexts.forEach((todoText) => {
        todoArr.push(todoText);
    });

    localStorage.setItem("todos", JSON.stringify(todoArr));
}

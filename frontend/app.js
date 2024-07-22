const btn = document.querySelector(".btn");
const content = document.querySelector(".content");
const input = document.querySelector(".input");
const currentDateElem = document.querySelector("#currentDate");
const prevDayBtn = document.querySelector("#prevDay");
const nextDayBtn = document.querySelector("#nextDay");
const datePicker = document.querySelector("#datePicker");
const markDisplay = document.querySelector("#markDisplay");

const formatDate = (date) => date.toISOString().split('T')[0];

const saveCurrentDate = (date) => localStorage.setItem('currentDate', formatDate(date));

const loadCurrentDate = () => {
    const savedDate = localStorage.getItem('currentDate');
    return savedDate ? new Date(savedDate) : new Date();
};

let currentDate = loadCurrentDate();

const updateDateDisplay = () => {
    currentDateElem.textContent = formatDate(currentDate);
    datePicker.value = formatDate(currentDate);
    saveCurrentDate(currentDate);
};

const calculateMarks = (todos) => {
    if (todos.length === 0) {
        return 0;
    }
    const completedTodos = todos.filter(todo => todo.completed).length;
    return (completedTodos / todos.length) * 10;
};

const loadTodos = async (date) => {
    const response = await fetch(`/todos/${formatDate(date)}`);
    const todos = await response.json();
    content.innerHTML = ''; // Clear previous todos
    todos.forEach(todo => addElement(todo.text, todo.completed, todo._id));
    const marks = calculateMarks(todos);
    markDisplay.textContent = `Marks: ${marks.toFixed(1)} / 10`;
};

const addElement = (text = '', completed = false, id = null) => {
    const node = document.createElement("li");
    node.classList.toggle('strikethrough', completed);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = "checkItem";
    checkBox.checked = completed;

    checkBox.addEventListener('change', async (event) => {
        node.classList.toggle('strikethrough', event.target.checked);
        await fetch(`/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: event.target.checked })
        });
        loadTodos(currentDate);
    });

    const textnode = document.createTextNode(text);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener('click', async () => {
        await fetch(`/todos/${id}`, {
            method: 'DELETE'
        });
        content.removeChild(node);
        loadTodos(currentDate);
    });

    node.appendChild(checkBox);
    node.appendChild(textnode);
    node.appendChild(deleteBtn);
    content.appendChild(node);
    input.value = "";
};

btn.addEventListener('click', async () => {
    if (input.value !== "") {
        const response = await fetch('/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input.value, completed: false, date: formatDate(currentDate) })
        });
        const newTodo = await response.json();
        addElement(newTodo.text, newTodo.completed, newTodo._id);
        loadTodos(currentDate);
    }
});

input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        btn.click();
    }
});

prevDayBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateDisplay();
    loadTodos(currentDate);
});

nextDayBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
    loadTodos(currentDate);
});

datePicker.addEventListener('change', (event) => {
    currentDate = new Date(event.target.value);
    updateDateDisplay();
    loadTodos(currentDate);
});

updateDateDisplay();
loadTodos(currentDate);

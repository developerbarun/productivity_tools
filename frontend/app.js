const btn = document.querySelector(".btn");
const content = document.querySelector(".content");
const input = document.querySelector(".input");
const dateIs = document.querySelector(".dateIs");

const a = dateIs.innerHTML = "Date : " + new Date().toLocaleDateString();

const loadTodos = async () => {
    const response = await fetch('/todos');
    const todos = await response.json();

    todos.forEach(todo => {
        addElement(todo.text, todo.completed, todo._id);
    });
}

const addElement = (text = '', completed = false, id = null) => {
    const node = document.createElement("li");
    node.classList.toggle('strikethrough', completed);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = "checkItem";
    checkBox.checked = completed;

    checkBox.addEventListener('change', async (event) => {
        if (event.target.checked) {
            node.classList.add('strikethrough');
        } else {
            node.classList.remove('strikethrough');
        }
        await fetch(`/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: event.target.checked })
        });
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
    });

    node.appendChild(checkBox);
    node.appendChild(textnode);
    node.appendChild(deleteBtn);
    content.appendChild(node);
    input.value = "";
}

btn.addEventListener('click', async () => {
    if (input.value !== "") {
        const response = await fetch('/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input.value, completed: false })
        });
        const newTodo = await response.json();
        addElement(newTodo.text, newTodo.completed, newTodo._id);
    }
});

input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        btn.click();
    }
});

loadTodos();
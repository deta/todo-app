import './style.css';

let todos = [];

const todosList = document.getElementById('todos');
const inputElement = document.getElementById('input');

/**
 * Get list of ToDos
 */
async function getTodos() {
  const request = await fetch('/api');
  const data = await request.json();
  
  todos = data.todos;
  renderTodos();
}

/**
 * Add ToDo to the list
 * @param {string} text Todo content 
 */
async function addTodo(text) {
  const trimmedText = text.trim();

  if (trimmedText === '') return inputElement.focus();
  inputElement.value = '';

  const response = await fetch('/api', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: trimmedText })
  });

  const data = await response.json();

  todos.push(data.todo);
  renderTodos();
}

/**
 * Toggle Todo's done status
 * @param {string} key Key of the ToDo 
 */
async function toggleTodo(key) {
  todos = todos.map((todo) => {
    if (todo.key === key) todo.done = !todo.done;
    return todo;
  });
  renderTodos();

  await fetch(`/api/${key}`, { method: 'PUT' });
}

/**
 * Remove ToDo from the list
 * @param {string} key Key of the ToDo 
 */
async function removeTodo(key) {  
  todos = todos.filter((todo) => todo.key !== key);
  renderTodos();

  await fetch(`/api/${key}`, { method: 'DELETE' });
}

/**
 * Render list with ToDos
 */
function renderTodos() {
  todosList.innerHTML = '';
  
  todos.forEach((todo, i) => {
    const key = todo.key;

    const todoElement = document.createElement('div');
    todoElement.className = 'todo';

    const textElement = document.createElement('div');
    textElement.className = `text ${todo.done ? 'done' : ''}`;
    textElement.innerText = todo.text;

    const deleteElement = document.createElement('img');
    deleteElement.className = 'action';
    deleteElement.src = '/trashbin.svg';
    deleteElement.tabIndex = 0;
    deleteElement.addEventListener('click', () => removeTodo(key));
    deleteElement.addEventListener('keyup', (event) => event.key === 'Enter' && removeTodo(key));
  
    const toggleElement = document.createElement('img');
    toggleElement.className = `action ${todo.done ? 'active' : ''}`;
    toggleElement.src = '/check.svg';
    toggleElement.tabIndex = 0;
    toggleElement.addEventListener('click', () => toggleTodo(key));
    toggleElement.addEventListener('keyup', (event) => event.key === 'Enter' && toggleTodo(key));

    todoElement.append(toggleElement);
    todoElement.append(textElement);
    todoElement.append(deleteElement);

    todosList.prepend(todoElement);  
  });
}

// Add ToDo on Enter
inputElement.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') addTodo(event.target.value);
});

// Initial rendering
getTodos();
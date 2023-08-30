import './style.css';
import check from './public/check.svg';
import trashbin from './public/trashbin.svg';
import { Base } from 'deta';

const db = Base('todos');
let todos = [];

const todosList = document.getElementById('todos');
const inputElement = document.getElementById('input');

/**
 * Get list of ToDos
 */
async function getTodos() {
  const td = await db.fetch();
  td.items.sort((a, b) => a.createdAt - b.createdAt);
  todos = td.items;
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

  const todo = await db.put({
    text: trimmedText,
    createdAt: Date.now(),
    done: false
  });


  todos.push(todo);
  renderTodos();
}

/**
 * Toggle Todo's done status
 * @param {string} key Key of the ToDo 
 */
async function toggleTodo(key) {
  const todo = todos.find((todo) => todo.key === key);
  const updated = await db.put({...todo, done: !todo.done});
  todos = todos.map((todo) => todo.key === key ? updated : todo);
  renderTodos();

}

/**
 * Remove ToDo from the list
 * @param {string} key Key of the ToDo 
 */
async function removeTodo(key) {
  await db.delete(key);
  todos = todos.filter((todo) => todo.key !== key);
  renderTodos();
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
    deleteElement.src = trashbin;
    deleteElement.tabIndex = 0;
    deleteElement.addEventListener('click', () => removeTodo(key));
    deleteElement.addEventListener('keyup', (event) => event.key === 'Enter' && removeTodo(key));
  
    const toggleElement = document.createElement('img');
    toggleElement.className = `action ${todo.done ? 'active' : ''}`;
    toggleElement.src =check;
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
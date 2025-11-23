import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000/todos'; // URL of your Express API

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Fetch todos on component mount
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setTodos)
      .catch(console.error);
  }, []);

  // Add new todo
  const addTodo = () => {
    if (!newTask.trim()) return;
    const newTodo = [{ task: newTask, completed: false }];
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((added) => {
        setTodos([...todos, ...added]);
        setNewTask('');
      })
      .catch(console.error);
  };

  // Toggle completion status
  const toggleComplete = (id) => {
    const todo = todos.find((t) => t.id === id);
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    })
      .then(() => {
        setTodos(
          todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      })
      .catch(console.error);
  };

  // Delete todo
  const deleteTodo = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTodos(todos.filter((t) => t.id !== id));
      })
      .catch(console.error);
  };

  return (
    <div>
      <h1>My Todo List</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter new task"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(({ id, task, completed }) => (
          <li key={id}>
            <label style={{ textDecoration: completed ? 'line-through' : '' }}>
              <input
                type="checkbox"
                checked={completed}
                onChange={() => toggleComplete(id)}
              />
              {task}
            </label>
            <button onClick={() => deleteTodo(id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

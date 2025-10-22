import React, { useState } from 'react';
import '../styles/todoItem.css';
export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: todo.title, description: todo.description });

  const save = async () => {
    await onUpdate(todo._id, form);
    setEditing(false);
  };

  const toggleComplete = async () => {
    await onUpdate(todo._id, { isCompleted: !todo.isCompleted });
  };

  return (
    <div className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
      {editing ? (
        <>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="todo-actions">
            <button onClick={save}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="left">
            <input type="checkbox" checked={todo.isCompleted} onChange={toggleComplete} />
            <div className="content">
              <h4>{todo.title}</h4>
              <p>{todo.description}</p>
              <small>Created: {new Date(todo.createdAt).toLocaleString()}</small>
            </div>
          </div>
          <div className="todo-actions">
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={() => onDelete(todo._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

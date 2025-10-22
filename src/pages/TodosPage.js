


import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { getToken, removeToken } from '../utils/auth';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import Analytics from '../components/Analytics';
import { useNavigate } from 'react-router-dom';
import '../styles/todos.css';

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const res = await API.get('/todos', { params: { filter, search } });
      setTodos(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        removeToken();
        nav('/login');
      } else {
        setErr('Unable to load todos');
      }
    }
  };

  useEffect(() => {
    if (!getToken()) {
      nav('/login');
      return;
    }
    fetchTodos();
    // eslint-disable-next-line
  }, [filter, search]);

  // Add new todo
  const addTodo = async (data) => {
    try {
      const res = await API.post('/todos', data);
      setTodos(prev => [res.data, ...prev]);
    } catch (err) {
      setErr('Create failed');
    }
  };

  // Update todo
  const updateTodo = async (id, data) => {
    try {
      const res = await API.put(`/todos/${id}`, data);
      setTodos(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (err) {
      setErr('Update failed');
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      setErr('Delete failed');
    }
  };

  // Compute counts for analytics
  const completedCount = todos.filter(t => t.isCompleted).length;
  const pendingCount = todos.filter(t => !t.isCompleted).length;

  return (
    <div className="todos-page">
      <div className="top-controls">
        <div className="left-controls">
          {/* Filter Buttons */}
          <div className="filters">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
            <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
            <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
          </div>

          {/* Search Input */}
          <div className="search">
            <input
              type="text"
              placeholder="Search title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Analytics */}
        <Analytics completedCount={completedCount} pendingCount={pendingCount} />
      </div>

      {/* Todo Form */}
      <TodoForm onSubmit={addTodo} />

      {/* Error Message */}
      {err && <div className="error">{err}</div>}

      {/* Todos List */}
      <div className="todos-list">
        {todos.length === 0 ? (
          <p className="muted">No todos yet.</p>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

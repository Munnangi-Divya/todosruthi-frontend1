import React, { useState } from 'react';
import '../styles/todoForm.css'

export default function TodoForm({ onSubmit, initial = { title: '', description: '' }, submitLabel = 'Add' }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setForm({ title: '', description: '' });
    setLoading(false);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <button type="submit" disabled={loading}>{loading ? '...' : submitLabel}</button>
    </form>
  );
}

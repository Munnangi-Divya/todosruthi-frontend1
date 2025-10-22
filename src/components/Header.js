import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeToken, getToken } from '../utils/auth';
import '../styles/header.css';

export default function Header() {
  const nav = useNavigate();
  const token = getToken();

  const logout = () => {
    removeToken();
    nav('/login');
  };

  return (
    <header className="header">
      <div className="brand"><Link to="/">TodoMERN</Link></div>
      <nav>
        <Link to="/todos">Todos</Link>
        {token ? <button className="link-btn" onClick={logout}>Logout</button> : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

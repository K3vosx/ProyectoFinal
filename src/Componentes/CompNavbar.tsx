
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../Context/AuthContext';

export const CompNavbar = () => {
  const [theme, setTheme] = useState('light');
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 

  const toggleTheme = () => {
    const nuevoTema = theme === 'light' ? 'dark' : 'light';
    setTheme(nuevoTema);
    document.documentElement.setAttribute('data-theme', nuevoTema);
  };

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <header>
      <nav className="fala-navbar">
        <div className="fala-container">
          <Link to="/" className="fala-logo">falabella<span className="com">.com</span></Link>
          <div className="fala-search">
            <input type="text" placeholder="Buscar en falabella.com" />
            <button className="search-btn">🔍</button>
          </div>

          <div className="fala-actions">
            <button onClick={toggleTheme} className="theme-toggle">{theme === 'light' ? '🌙' : '☀️'}</button>

            {user ? (
              <div className="user-menu">
                <div className="user-greeting">
                  <span>Hola,</span>
                  <span className="user-name">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-link">👤 Hola, Inicia sesión</Link>
            )}

            <Link to="/proyecto" className="btn-empezar">♻️ Ir al Reciclaje</Link>
          </div>
        </div>
      </nav>
      <div className="fala-categories">
        <span>Menú</span>
        <span>Mujer</span>
        <span>Hombre</span>
        <span>Niños</span>
        <span>Zapatos</span>
        <span className="highlight">Reciclaje Textil</span>
      </div>
    </header>
  );
};
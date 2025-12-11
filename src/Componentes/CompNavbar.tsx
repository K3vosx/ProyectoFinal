
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
import { useAuth } from '../Context/AuthContext';

export const CompNavbar = () => {
  const [theme, setTheme] = useState('light');
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // 2. Activar el hook de navegación

  const toggleTheme = () => {
    const nuevoTema = theme === 'light' ? 'dark' : 'light';
    setTheme(nuevoTema);
    document.documentElement.setAttribute('data-theme', nuevoTema);
  };

  // 3. Crear función manejadora para salir
  const handleLogout = () => {
    logout(); // Borra el usuario del contexto
    navigate('/login'); // Redirige suavemente sin recargar la página
  };

  return (
    <header>
      <nav className="fala-navbar">
        {/* ... (Todo el código del logo y buscador sigue igual) ... */}
        <div className="fala-container">
          <Link to="/" className="fala-logo">falabella<span className="com">.com</span></Link>
          {/* ... buscador ... */}
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
                {/* 4. Usar la nueva función handleLogout */}
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
      {/* ... (Categorías siguen igual) ... */}
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
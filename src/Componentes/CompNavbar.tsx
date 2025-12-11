import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const CompNavbar = () => {
  const [theme, setTheme] = useState('light');
  const { user, logout } = useAuth(); 

  const toggleTheme = () => {
    const nuevoTema = theme === 'light' ? 'dark' : 'light';
    setTheme(nuevoTema);
    document.documentElement.setAttribute('data-theme', nuevoTema);
  };

  return (
    <header>
      <nav className="fala-navbar">
        <div className="fala-container">
          {/* Logo */}
          <Link to="/" className="fala-logo">
            falabella<span className="com">.com</span>
          </Link>

          {/* Buscador */}
          <div className="fala-search">
             <input type="text" placeholder="Buscar en falabella.com" />
             <button className="search-btn">🔍</button>
          </div>

          <div className="fala-actions">
            {/* Botón Tema */}
            <button onClick={toggleTheme} className="theme-toggle" title="Cambiar Tema">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* --- SECCIÓN DE USUARIO CORREGIDA --- */}
            {user ? (
                <div className="user-menu">
                    {/* Saludo con estilos mejorados */}
                    <div className="user-greeting">
                        <span>Hola,</span>
                        {/* Solo mostramos el username, sin el rol */}
                        <span className="user-name">{user.username}</span>
                    </div>
                    
                    {/* Botón Salir más elegante */}
                    <button onClick={logout} className="btn-logout">
                        Cerrar sesión
                    </button>
                </div>
            ) : (
                // Enlace de Login estilizado
                <Link to="/login" className="login-link">
                    👤 Hola, Inicia sesión
                </Link>
            )}

            <Link to="/proyecto" className="btn-empezar">
              ♻️ Ir al Reciclaje
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Categorías */}
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
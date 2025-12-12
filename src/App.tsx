import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AuthProvider, useAuth } from './Context/AuthContext';
import { CompNavbar } from './Componentes/CompNavbar';
import { CompHome } from './Componentes/CompHome';
import { CompLogin } from './Componentes/CompLogin';
import { CompGetPrendas } from './Componentes/CompGetPrendas';
import { CompPostPrenda } from './Componentes/CompPostPrenda';
import { ServAlovaAdmin } from './Servicios/ServAlovaAdmin'; 


import React from 'react';


const RutaPrivada = ({ children, rolRequerido }: { children: React.ReactNode, rolRequerido?: 'cliente' | 'admin' }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (rolRequerido && user.rol !== rolRequerido) {
    return <Navigate to="/" />;
  }

  return children;
};
const AppContent = () => {
  const [tabActiva, setTabActiva] = useState<'registro' | 'trazabilidad'>('registro');
  const { user } = useAuth();

  return (
    <>
      <CompNavbar />
      <Routes>
        <Route path="/" element={<CompHome />} />

        <Route path="/login" element={<CompLogin />} />

        <Route path="/proyecto" element={
          <RutaPrivada rolRequerido="cliente">
            <div className="proyecto-container">
              <h2 className="panel-title">Panel de Reciclaje - Hola {user?.username}</h2>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => setTabActiva('registro')} className={`tab-button ${tabActiva === 'registro' ? 'active' : ''}`}>📝 Registrar</button>
                <button onClick={() => setTabActiva('trazabilidad')} className={`tab-button ${tabActiva === 'trazabilidad' ? 'active' : ''}`}>🔍 Mis Prendas</button>
              </div>
              <div className="panel-content">
                {tabActiva === 'registro' ? <CompPostPrenda /> : <CompGetPrendas />}
              </div>
            </div>
          </RutaPrivada>
        } />

        <Route path="/admin-dashboard" element={
          <RutaPrivada rolRequerido="admin">
            <div className="proyecto-container">
              <h2 className="panel-title" style={{ color: 'var(--fala-orange)' }}>🛡️ Panel Administrativo</h2>
              <div className="panel-content">
                <ServAlovaAdmin />
              </div>
            </div>
          </RutaPrivada>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
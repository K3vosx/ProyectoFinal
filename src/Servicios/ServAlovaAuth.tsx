import { useState } from 'react';
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import { SUPABASE_URL, supabaseHeaders } from './supabaseConfig';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ServAlovaAuth = () => {
    // Estados
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    // Hooks
    const { login } = useAuth();
    const navigate = useNavigate();

    // Instancia Alova
    const instanceAlova = createAlova({
        baseURL: `${SUPABASE_URL}/rest/v1`,
        requestAdapter: adapterFetch(),
        beforeRequest(method) {
            method.config.headers = supabaseHeaders;
        },
        responded: (response) => response.json()
    });

    const handleLogin = (rolEsperado: 'cliente' | 'admin') => {
        setError("");
        
        if (!username || !password) {
            setError("⚠️ Por favor ingresa usuario y contraseña");
            return;
        }

        const query = `/Usuario?username=eq.${username}&password=eq.${password}&rol=eq.${rolEsperado}&select=*`;

        instanceAlova.Get(query)
            .then((data: any) => {
                if (data.length > 0) {
                    const usuarioEncontrado = data[0];
                    login(usuarioEncontrado);
                    
                    if (rolEsperado === 'admin') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/proyecto');
                    }
                } else {
                    setError("❌ Usuario no encontrado o rol incorrecto.");
                }
            })
            .catch((err) => {
                console.error(err);
                setError("Error de conexión con el servidor.");
            });
    };

    return (
        <div className="login-card">
            <h2 className="login-title">Bienvenido</h2>
            <p className="login-subtitle">Inicia sesión para gestionar tus residuos textiles</p>
            
            <div className="login-form">
                <div className="login-input-group">
                    <label className="login-label">Usuario</label>
                    <input 
                        type="text" 
                        className="login-input"
                        placeholder="Ej: juan" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>

                <div className="login-input-group">
                    <label className="login-label">Contraseña</label>
                    <input 
                        type="password" 
                        className="login-input"
                        placeholder="••••••••" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                
                {error && (
                    <div style={{
                        padding: '10px', 
                        background: '#ffebee', 
                        color: '#c62828', 
                        borderRadius: '8px', 
                        fontSize: '0.9rem', 
                        marginBottom: '15px',
                        border: '1px solid #ef9a9a'
                    }}>
                        {error}
                    </div>
                )}

                <div className="login-actions">
                    <button 
                        onClick={() => handleLogin('cliente')}
                        className="btn-login btn-client"
                    >
                        👤 Soy Cliente
                    </button>
                    <button 
                        onClick={() => handleLogin('admin')}
                        className="btn-login btn-admin"
                    >
                        🛡️ Soy Admin
                    </button>
                </div>
            </div>
        </div>
    );
};
import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react'; // <--- SEPARA ESTA IMPORTACIÓN ASÍ

// Tipos de datos del Usuario (según tu nueva base de datos)
interface User {
    id: number;
    username: string;
    rol: 'cliente' | 'admin';
    puntos_acumulados?: number;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // 1. Intentamos leer si ya había sesión guardada en LocalStorage
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('session_user');
        return saved ? JSON.parse(saved) : null;
    });

    // 2. Función para Iniciar Sesión
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('session_user', JSON.stringify(userData));
    };

    // 3. Función para Cerrar Sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem('session_user');
        window.location.href = "/login"; // Redirigir a login forzado
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar la sesión en cualquier parte
export const useAuth = () => useContext(AuthContext);
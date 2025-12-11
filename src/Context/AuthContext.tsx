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
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('session_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('session_user', JSON.stringify(userData));
    };

    // MODIFICACIÓN AQUÍ:
    const logout = () => {
        setUser(null);
        localStorage.removeItem('session_user');
        // ELIMINAMOS: window.location.href = "/login"; 
        // Ya no recargamos la página bruscamente.
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
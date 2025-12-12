import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react'; 

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

    const logout = () => {
        setUser(null);
        localStorage.removeItem('session_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
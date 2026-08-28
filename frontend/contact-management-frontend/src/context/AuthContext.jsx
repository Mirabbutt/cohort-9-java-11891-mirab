import { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            console.error('Failed to parse saved user data:', e);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        }
    });

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (e) {
            console.error('Failed to clear storage during logout:', e);
        } finally {
            setUser(null);
        }
    };

    const isAuthenticated = !!user;

    const contextValue = useMemo(
        () => ({ user, login, logout, isAuthenticated }),
        [user, isAuthenticated]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
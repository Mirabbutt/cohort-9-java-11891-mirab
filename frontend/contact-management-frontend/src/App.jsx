import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactsPage from './pages/ContactsPage';
import AddContactPage from './pages/AddContactPage';
import EditContactPage from './pages/EditContactPage';

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/contacts"
                element={
                    <PrivateRoute>
                        <ContactsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/contacts/new"
                element={
                    <PrivateRoute>
                        <AddContactPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/contacts/:id/edit"
                element={
                    <PrivateRoute>
                        <EditContactPage />
                    </PrivateRoute>
                }
            />s
            <Route path="*" element={<Navigate to="/contacts" />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
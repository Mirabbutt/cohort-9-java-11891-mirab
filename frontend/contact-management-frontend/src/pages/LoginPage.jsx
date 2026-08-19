import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [usernameOrPhone, setUsernameOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await loginUser({ usernameOrPhone, password });
            const { token, userId, firstName, lastName, email } = response.data;
            login({ userId, firstName, lastName, email }, token);
            navigate('/contacts');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Log in</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Email or phone number"
                        value={usernameOrPhone}
                        onChange={(e) => setUsernameOrPhone(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>
                <p style={styles.link}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' },
    card: { background: 'white', padding: '32px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '320px' },
    title: { textAlign: 'center', marginBottom: '20px' },
    input: { width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', marginTop: '10px', cursor: 'pointer' },
    error: { color: '#dc2626', fontSize: '13px' },
    link: { textAlign: 'center', marginTop: '16px', fontSize: '14px' },
};

export default LoginPage;
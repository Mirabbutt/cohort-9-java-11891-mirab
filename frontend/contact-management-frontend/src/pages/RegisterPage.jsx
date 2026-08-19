import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phoneNumber: '', password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await registerUser(formData);
            const { token, userId, firstName, lastName, email } = response.data;
            login({ userId, firstName, lastName, email }, token);
            navigate('/contacts');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create account</h2>
                <form onSubmit={handleSubmit}>
                    <input name="firstName" placeholder="First name" onChange={handleChange} style={styles.input} required />
                    <input name="lastName" placeholder="Last name" onChange={handleChange} style={styles.input} required />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} style={styles.input} />
                    <input name="phoneNumber" placeholder="Phone number" onChange={handleChange} style={styles.input} />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} required />
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                <p style={styles.link}>
                    Already have an account? <Link to="/login">Log in</Link>
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

export default RegisterPage;
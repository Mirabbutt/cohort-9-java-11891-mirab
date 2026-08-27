import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await changePassword({ oldPassword, newPassword });
            setMessage('Password changed successfully');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <button onClick={() => navigate('/contacts')} style={styles.backButton}>&larr; Back</button>
                <h2 style={styles.title}>My Profile</h2>

                <div style={styles.infoBox}>
                    <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                    {user?.email && <p><strong>Email:</strong> {user.email}</p>}
                </div>

                <h3 style={styles.subtitle}>Change Password</h3>
                <form onSubmit={handleChangePassword}>
                    <input
                        type="password"
                        placeholder="Current password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    {error && <p style={styles.error}>{error}</p>}
                    {message && <p style={styles.success}>{message}</p>}
                    <button type="submit" style={styles.saveButton} disabled={loading}>
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>

                <button onClick={handleLogout} style={styles.logoutButton}>Log out</button>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', paddingTop: '60px', fontFamily: 'Arial, sans-serif' },
    card: { background: 'white', padding: '32px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '340px' },
    backButton: { background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, marginBottom: '10px', fontSize: '14px' },
    title: { marginBottom: '10px' },
    infoBox: { background: '#f9fafb', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
    subtitle: { fontSize: '16px', marginBottom: '10px' },
    input: { width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' },
    error: { color: '#dc2626', fontSize: '13px' },
    success: { color: '#16a34a', fontSize: '13px' },
    saveButton: { width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' },
    logoutButton: { width: '100%', padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '20px' },
};

export default ProfilePage;
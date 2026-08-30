import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from '../components/ChangePasswordModal';

function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleChangePassword = async (data) => {
        await changePassword(data);
        setMessage('Password changed successfully');
        setModalOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <button type="button" onClick={() => navigate('/contacts')} style={styles.backButton}>&larr; Back</button>
                <h2 style={styles.title}>My Profile</h2>

                <div style={styles.infoBox}>
                    <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                    {user?.email && <p><strong>Email:</strong> {user.email}</p>}
                </div>

                {message && <p style={styles.success}>{message}</p>}

                <button type="button" onClick={() => setModalOpen(true)} style={styles.changePasswordButton}>
                    Change password
                </button>

                <button type="button" onClick={handleLogout} style={styles.logoutButton}>Log out</button>
            </div>

            <ChangePasswordModal
                isOpen={modalOpen}
                onSave={handleChangePassword}
                onCancel={() => setModalOpen(false)}
            />
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', paddingTop: '60px', fontFamily: 'Arial, sans-serif' },
    card: { background: 'white', padding: '32px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '340px' },
    backButton: { background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, marginBottom: '10px', fontSize: '14px' },
    title: { marginBottom: '10px' },
    infoBox: { background: '#f9fafb', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' },
    success: { color: '#16a34a', fontSize: '13px' },
    changePasswordButton: { width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' },
    logoutButton: { width: '100%', padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '20px' },
};

export default ProfilePage;
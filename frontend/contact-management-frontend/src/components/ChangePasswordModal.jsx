import { useState } from 'react';

function ChangePasswordModal({ isOpen, onSave, onCancel }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleReset = () => {
        setOldPassword('');
        setNewPassword('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onSave({ oldPassword, newPassword });
            handleReset();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        handleReset();
        onCancel();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={styles.title}>Change password</h3>
                <form onSubmit={handleSubmit}>
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
                    <div style={styles.buttonRow}>
                        <button type="button" onClick={handleCancel} style={styles.cancelButton}>Cancel</button>
                        <button type="button" onClick={handleReset} style={styles.resetButton}>Reset</button>
                        <button type="submit" style={styles.saveButton} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.4)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modal: {
        background: 'white', padding: '28px', borderRadius: '10px',
        width: '320px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    title: { margin: '0 0 16px 0', fontSize: '18px' },
    input: { width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' },
    error: { color: '#dc2626', fontSize: '13px' },
    buttonRow: { display: 'flex', gap: '8px', marginTop: '14px' },
    cancelButton: { flex: 1, padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    resetButton: { flex: 1, padding: '10px', background: '#fef3c7', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    saveButton: { flex: 1, padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
};

export default ChangePasswordModal;
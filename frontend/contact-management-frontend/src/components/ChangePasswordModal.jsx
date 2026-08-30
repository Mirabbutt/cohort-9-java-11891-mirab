import { useState } from 'react';
import { modalStyles } from './modalStyles';

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
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h3 style={modalStyles.title}>Change password</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Current password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        style={modalStyles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={modalStyles.input}
                        required
                    />
                    {error && <p style={modalStyles.error}>{error}</p>}
                    <div style={modalStyles.buttonRow}>
                        <button type="button" onClick={handleCancel} style={modalStyles.cancelButton}>Cancel</button>
                        <button type="button" onClick={handleReset} style={localStyles.resetButton}>Reset</button>
                        <button type="submit" style={modalStyles.saveButton} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const localStyles = {
    resetButton: { flex: 1, padding: '10px', background: '#fef3c7', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
};

export default ChangePasswordModal;
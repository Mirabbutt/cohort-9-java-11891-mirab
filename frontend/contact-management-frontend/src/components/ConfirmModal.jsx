import { modalStyles } from './modalStyles';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h3 style={modalStyles.title}>{title}</h3>
                <p style={localStyles.message}>{message}</p>
                <div style={modalStyles.buttonRow}>
                    <button type="button" onClick={onCancel} style={modalStyles.cancelButton}>Cancel</button>
                    <button type="button" onClick={onConfirm} style={localStyles.confirmButton}>Delete</button>
                </div>
            </div>
        </div>
    );
}

const localStyles = {
    message: { color: '#555', fontSize: '14px', marginBottom: '20px' },
    confirmButton: { padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default ConfirmModal;
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={styles.title}>{title}</h3>
                <p style={styles.message}>{message}</p>
                <div style={styles.buttonRow}>
                    <button type="button" onClick={onCancel} style={styles.cancelButton}>Cancel</button>
                    <button type="button" onClick={onConfirm} style={styles.confirmButton}>Delete</button>
                </div>
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
        background: 'white', padding: '24px', borderRadius: '10px',
        width: '320px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    title: { margin: '0 0 10px 0', fontSize: '18px' },
    message: { color: '#555', fontSize: '14px', marginBottom: '20px' },
    buttonRow: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
    cancelButton: { padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    confirmButton: { padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default ConfirmModal;
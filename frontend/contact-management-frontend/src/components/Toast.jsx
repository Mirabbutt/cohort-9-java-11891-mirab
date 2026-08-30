function Toast({ message, type = 'success' }) {
    if (!message) return null;
    const bg = type === 'success' ? '#dcfce7' : '#fee2e2';
    const color = type === 'success' ? '#166534' : '#991b1b';
    return (
        <div style={{
            position: 'fixed', top: '20px', right: '20px', background: bg, color,
            padding: '12px 18px', borderRadius: '8px', fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 2000,
            display: 'flex', alignItems: 'center', gap: '8px',
        }}>
            {message}
        </div>
    );
}

export default Toast;
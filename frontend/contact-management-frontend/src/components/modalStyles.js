export const modalStyles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.4)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modal: {
        background: 'white', padding: '28px', borderRadius: '10px',
        width: '340px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    title: { margin: '0 0 16px 0', fontSize: '18px' },
    input: { width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' },
    error: { color: '#dc2626', fontSize: '13px' },
    buttonRow: { display: 'flex', gap: '10px', marginTop: '14px' },
    cancelButton: { flex: 1, padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    saveButton: { flex: 1, padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};
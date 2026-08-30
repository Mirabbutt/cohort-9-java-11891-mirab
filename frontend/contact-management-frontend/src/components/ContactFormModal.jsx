import { useState, useEffect } from 'react';

function ContactFormModal({ isOpen, mode, initialData, onSave, onCancel }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFirstName(initialData?.firstName || '');
            setLastName(initialData?.lastName || '');
            setTitle(initialData?.title || '');
            setEmail(initialData?.emails?.[0]?.email || '');
            setPhone(initialData?.phones?.[0]?.phoneNumber || '');
            setError('');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onSave({
                firstName,
                lastName,
                title,
                emails: email ? [{ email, label: 'personal' }] : [],
                phones: phone ? [{ phoneNumber: phone, label: 'mobile' }] : [],
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save contact');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={styles.title}>{mode === 'edit' ? 'Update contact' : 'Create contact'}</h3>
                <form onSubmit={handleSubmit}>
                    <input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={styles.input} required />
                    <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={styles.input} required />
                    <input placeholder="Title (e.g. Friend, Colleague)" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
                    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
                    <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} />
                    {error && <p style={styles.error}>{error}</p>}
                    <div style={styles.buttonRow}>
                        <button type="button" onClick={onCancel} style={styles.cancelButton}>Cancel</button>
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
        width: '340px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    title: { margin: '0 0 16px 0', fontSize: '18px' },
    input: { width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' },
    error: { color: '#dc2626', fontSize: '13px' },
    buttonRow: { display: 'flex', gap: '10px', marginTop: '14px' },
    cancelButton: { flex: 1, padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    saveButton: { flex: 1, padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default ContactFormModal;
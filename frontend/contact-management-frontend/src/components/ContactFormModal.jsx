import { useState, useEffect } from 'react';
import { modalStyles } from './modalStyles';

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
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h3 style={modalStyles.title}>{mode === 'edit' ? 'Update contact' : 'Create contact'}</h3>
                <form onSubmit={handleSubmit}>
                    <input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={modalStyles.input} required />
                    <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={modalStyles.input} required />
                    <input placeholder="Title (e.g. Friend, Colleague)" value={title} onChange={(e) => setTitle(e.target.value)} style={modalStyles.input} />
                    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={modalStyles.input} />
                    <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={modalStyles.input} />
                    {error && <p style={modalStyles.error}>{error}</p>}
                    <div style={modalStyles.buttonRow}>
                        <button type="button" onClick={onCancel} style={modalStyles.cancelButton}>Cancel</button>
                        <button type="submit" style={modalStyles.saveButton} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ContactFormModal;
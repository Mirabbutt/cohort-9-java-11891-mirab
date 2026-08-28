import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getContactById, updateContact } from '../services/api';

function EditContactPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        loadContact();
    }, [id]);

    const loadContact = async () => {
        try {
            const response = await getContactById(id);
            const c = response.data;
            setFirstName(c.firstName || '');
            setLastName(c.lastName || '');
            setTitle(c.title || '');
            setEmail(c.emails?.[0]?.email || '');
            setPhone(c.phones?.[0]?.phoneNumber || '');
        } catch (err) {
            console.error('Failed to load contact:', err);
            setError('Could not load contact');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await updateContact(id, {
                firstName,
                lastName,
                title,
                emails: email ? [{ email, label: 'personal' }] : [],
                phones: phone ? [{ phoneNumber: phone, label: 'mobile' }] : [],
            });
            navigate('/contacts');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update contact');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <p style={{ textAlign: 'center', marginTop: '60px' }}>Loading...</p>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Edit contact</h2>
                <form onSubmit={handleSubmit}>
                    <input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={styles.input} required />
                    <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={styles.input} required />
                    <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
                    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
                    <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} />
                    {error && <p style={styles.error}>{error}</p>}
                    <div style={styles.buttonRow}>
                        <button type="button" onClick={() => navigate('/contacts')} style={styles.cancelButton}>Cancel</button>
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
    container: { display: 'flex', justifyContent: 'center', paddingTop: '60px', fontFamily: 'Arial, sans-serif' },
    card: { background: 'white', padding: '32px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '340px' },
    title: { marginBottom: '20px' },
    input: { width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' },
    error: { color: '#dc2626', fontSize: '13px' },
    buttonRow: { display: 'flex', gap: '10px', marginTop: '14px' },
    cancelButton: { flex: 1, padding: '10px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    saveButton: { flex: 1, padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default EditContactPage;
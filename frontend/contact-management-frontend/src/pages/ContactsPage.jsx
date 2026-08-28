import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContacts, searchContacts, deleteContact } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const response = await getContacts();
            setContacts(response.data.contacts);
        } catch (err) {
            console.error('Failed to load contacts', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) {
            loadContacts();
            return;
        }
        setLoading(true);
        try {
            const response = await searchContacts(keyword);
            setContacts(response.data.contacts);
        } catch (err) {
            console.error('Search failed', err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteContact(deleteTarget.id);
            setDeleteTarget(null);
            loadContacts();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderContactsList = () => {
        if (loading) {
            return <p>Loading...</p>;
        }
        if (contacts.length === 0) {
            return <p style={styles.empty}>No contacts found</p>;
        }
        return (
            <div>
                {contacts.map((c) => (
                    <div key={c.id} style={styles.contactCard}>
                        <div>
                            <strong>{c.firstName} {c.lastName}</strong> {c.title && `(${c.title})`}
                            <div style={styles.details}>
                                {c.emails.map((e) => e.email).join(', ')}
                                {c.emails.length > 0 && c.phones.length > 0 && ' · '}
                                {c.phones.map((p) => p.phoneNumber).join(', ')}
                            </div>
                        </div>
                        <div style={styles.actions}>
                            <button type="button" onClick={() => navigate(`/contacts/${c.id}/edit`)} style={styles.editButton}>Edit</button>
                            <button type="button" onClick={() => setDeleteTarget(c)} style={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Welcome, {user?.firstName}</h2>
                <button type="button" onClick={() => navigate('/profile')} style={styles.profileButton}>Profile</button>
                <button type="button" onClick={handleLogout} style={styles.logoutButton}>Log out</button>
            </div>

            <form onSubmit={handleSearch} style={styles.searchRow}>
                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={styles.searchInput}
                />
                <button type="submit" style={styles.searchButton}>Search</button>
                <button type="button" onClick={() => navigate('/contacts/new')} style={styles.addButton}>+ Add contact</button>
            </form>

            {renderContactsList()}

            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete contact"
                message={`Are you sure you want to delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This can't be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}

const styles = {
    container: { maxWidth: '600px', margin: '40px auto', padding: '0 16px', fontFamily: 'Arial, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    logoutButton: { padding: '8px 14px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    profileButton: { padding: '8px 14px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' },
    searchRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
    searchInput: { flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '6px' },
    searchButton: { padding: '10px 16px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    addButton: { padding: '10px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' },
    empty: { textAlign: 'center', color: '#999', marginTop: '40px' },
    contactCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '14px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    details: { fontSize: '13px', color: '#666', marginTop: '4px' },
    actions: { display: 'flex', gap: '8px' },
    editButton: { padding: '6px 12px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    deleteButton: { padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
};

export default ContactsPage;
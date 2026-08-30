import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContacts, searchContacts, deleteContact, createContact, updateContact } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import ContactFormModal from '../components/ContactFormModal';
import Toast from '../components/Toast';

const AVATAR_COLORS = ['#2563eb', '#7c3aed', '#dc2626', '#059669', '#d97706', '#db2777'];

function getInitials(first, last) {
    return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
}

function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formModal, setFormModal] = useState({ isOpen: false, mode: 'create', data: null });
    const [toast, setToast] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [activeKeyword, setActiveKeyword] = useState('');

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadContacts();
    }, [page]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    const loadContacts = async () => {
        setLoading(true);
        try {
            const response = activeKeyword
                ? await searchContacts(activeKeyword, page)
                : await getContacts(page);
            setContacts(response.data.contacts);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error('Failed to load contacts', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = keyword.trim();
        setActiveKeyword(trimmed);
        setPage(0);
        setLoading(true);
        try {
            const response = trimmed ? await searchContacts(trimmed, 0) : await getContacts(0);
            setContacts(response.data.contacts);
            setTotalPages(response.data.totalPages || 1);
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
            showToast('Contact deleted');
            loadContacts();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleSaveContact = async (formData) => {
        if (formModal.mode === 'edit') {
            await updateContact(formModal.data.id, formData);
            showToast('Contact updated');
        } else {
            await createContact(formData);
            showToast('Contact added');
        }
        setFormModal({ isOpen: false, mode: 'create', data: null });
        loadContacts();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderContactsList = () => {
        if (loading) {
            return (
                <div>
                    {[1, 2].map((i) => (
                        <div key={i} style={styles.skeletonCard}>
                            <div style={styles.skeletonAvatar} />
                            <div style={{ flex: 1 }}>
                                <div style={styles.skeletonLine} />
                                <div style={{ ...styles.skeletonLine, width: '60%', marginTop: '6px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        if (contacts.length === 0) {
            return (
                <div style={styles.emptyState}>
                    <p style={styles.emptyTitle}>No contacts yet</p>
                    <p style={styles.emptyText}>Add your first contact to get started.</p>
                    <button type="button" onClick={() => setFormModal({ isOpen: true, mode: 'create', data: null })} style={styles.addButton}>
                        + Add contact
                    </button>
                </div>
            );
        }
        return (
            <div>
                {contacts.map((c) => {
                    const fullName = `${c.firstName} ${c.lastName}`;
                    return (
                        <div key={c.id} style={styles.contactCard}>
                            <div style={styles.contactLeft}>
                                <div style={{ ...styles.avatar, background: getAvatarColor(fullName) }}>
                                    {getInitials(c.firstName, c.lastName)}
                                </div>
                                <div>
                                    <strong>{c.firstName} {c.lastName}</strong> {c.title && `(${c.title})`}
                                    <div style={styles.details}>
                                        {c.emails.map((e) => e.email).join(', ')}
                                        {c.emails.length > 0 && c.phones.length > 0 && ' · '}
                                        {c.phones.map((p) => p.phoneNumber).join(', ')}
                                    </div>
                                </div>
                            </div>
                            <div style={styles.actions}>
                                <button type="button" onClick={() => setFormModal({ isOpen: true, mode: 'edit', data: c })} style={styles.editButton}>Edit</button>
                                <button type="button" onClick={() => setDeleteTarget(c)} style={styles.deleteButton}>Delete</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <Toast message={toast} />
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
                <button type="button" onClick={() => setFormModal({ isOpen: true, mode: 'create', data: null })} style={styles.addButton}>+ Add contact</button>
            </form>

            {renderContactsList()}

            {!loading && contacts.length > 0 && totalPages > 1 && (
                <div style={styles.pagination}>
                    <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} style={styles.pageButton}>Previous</button>
                    <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
                    <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} style={styles.pageButton}>Next</button>
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete contact"
                message={`Are you sure you want to delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This can't be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            <ContactFormModal
                isOpen={formModal.isOpen}
                mode={formModal.mode}
                initialData={formModal.data}
                onSave={handleSaveContact}
                onCancel={() => setFormModal({ isOpen: false, mode: 'create', data: null })}
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
    contactCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '14px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    contactLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 },
    details: { fontSize: '13px', color: '#666', marginTop: '4px' },
    actions: { display: 'flex', gap: '8px' },
    editButton: { padding: '6px 12px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    deleteButton: { padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    skeletonCard: { display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '14px', borderRadius: '8px', marginBottom: '10px' },
    skeletonAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#eee' },
    skeletonLine: { height: '10px', background: '#eee', borderRadius: '4px', width: '40%' },
    emptyState: { textAlign: 'center', marginTop: '50px', padding: '30px' },
    emptyTitle: { fontSize: '17px', fontWeight: 'bold', margin: '0 0 6px' },
    emptyText: { color: '#888', fontSize: '14px', marginBottom: '16px' },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px' },
    pageButton: { padding: '6px 14px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
    pageInfo: { fontSize: '13px', color: '#666' },
};

export default ContactsPage;
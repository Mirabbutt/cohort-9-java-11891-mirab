import { modalStyles } from './modalStyles';

function getInitials(first, last) {
    return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
}

function ContactDetailModal({ isOpen, contact, onEdit, onDelete, onClose }) {
    if (!isOpen || !contact) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={{ ...modalStyles.modal, width: '360px' }}>
                <div style={styles.header}>
                    <div style={{ ...styles.avatar, background: '#2563eb' }}>
                        {getInitials(contact.firstName, contact.lastName)}
                    </div>
                    <div>
                        <p style={styles.name}>{contact.firstName} {contact.lastName}</p>
                        {contact.title && <p style={styles.title}>{contact.title}</p>}
                    </div>
                </div>

                <div style={styles.divider}>
                    {contact.emails?.map((e, i) => (
                        <div key={i} style={styles.field}>
                            <p style={styles.fieldLabel}>Email{e.label ? ` (${e.label})` : ''}</p>
                            <p style={styles.fieldValue}>{e.email}</p>
                        </div>
                    ))}
                    {contact.phones?.map((p, i) => (
                        <div key={i} style={styles.field}>
                            <p style={styles.fieldLabel}>Phone{p.label ? ` (${p.label})` : ''}</p>
                            <p style={styles.fieldValue}>{p.phoneNumber}</p>
                        </div>
                    ))}
                    {(!contact.emails || contact.emails.length === 0) && (!contact.phones || contact.phones.length === 0) && (
                        <p style={styles.fieldValue}>No contact details added.</p>
                    )}
                </div>

                <div style={modalStyles.buttonRow}>
                    <button type="button" onClick={onClose} style={modalStyles.cancelButton}>Close</button>
                    <button type="button" onClick={() => onDelete(contact)} style={styles.deleteButton}>Delete</button>
                    <button type="button" onClick={() => onEdit(contact)} style={modalStyles.saveButton}>Edit</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
    avatar: { width: '48px', height: '48px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 },
    name: { fontWeight: 'bold', fontSize: '16px', margin: 0 },
    title: { fontSize: '13px', color: '#666', margin: 0 },
    divider: { borderTop: '1px solid #eee', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
    field: {},
    fieldLabel: { fontSize: '11px', color: '#999', margin: '0 0 2px' },
    fieldValue: { fontSize: '14px', margin: 0 },
    deleteButton: { flex: 1, padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default ContactDetailModal;
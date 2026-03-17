import '@src/styles/DeleteModal.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chatTitle?: string;
}

const DeleteModal = ({ isOpen, onClose, onConfirm, chatTitle }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div 
        className="delete-modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="delete-modal-header">
          <div className="delete-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="delete-modal-icon">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <h2 id="delete-modal-title">Delete Chat</h2>
        </div>
        
        <div className="delete-modal-body">
          <p>
            Are you sure you want to delete <strong>"{chatTitle || 'this chat'}"</strong>? 
          </p>
          <p className="delete-modal-warning">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="delete-modal-footer">
          <button className="delete-modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-modal-btn confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

import { useApp } from '../../context/AppContext';

export default function ConfirmDialog() {
  const { activeModal, confirmConfig, closeModal } = useApp();

  if (activeModal !== 'confirm' || !confirmConfig) return null;

  const { title, message, onConfirm, onCancel } = confirmConfig;

  const handleConfirm = () => {
    closeModal();
    onConfirm?.();
  };

  const handleCancel = () => {
    closeModal();
    onCancel?.();
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card confirm-modal-card">
        <button className="modal-close" onClick={handleCancel}>×</button>
        <div className="confirm-modal-content">
          <h2 id="confirm-title">{title}</h2>
          <p id="confirm-message">{message}</p>
          <div className="confirm-modal-actions">
            <button className="btn-ghost" onClick={handleCancel}>Cancel</button>
            <button className="btn-danger-confirm" onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Exibe notificações toast no canto superior direito.
 * Renderizado fora do fluxo normal (fixed positioning).
 */
export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast ${toast.type}`}
          onClick={() => onRemove(toast.id)}
          style={{ cursor: 'pointer' }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

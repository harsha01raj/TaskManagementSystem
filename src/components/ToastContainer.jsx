import { CheckCircle2, XCircle } from "lucide-react";

function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <div className={`toast ${toast.type}`} key={toast.id}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{toast.message}</span>
          <button type="button" aria-label="Close notification" onClick={() => onClose(toast.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;

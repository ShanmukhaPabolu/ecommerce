import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, actionText, actionLink, onActionClick) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setToast({ message, actionText, actionLink, onActionClick });
    
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            <span className="toast-msg">{toast.message}</span>
            {toast.actionText && toast.actionLink && (
              <Link to={toast.actionLink} className="toast-action" onClick={hideToast}>
                {toast.actionText}
              </Link>
            )}
            {toast.actionText && toast.onActionClick && (
              <button className="toast-action" onClick={() => { hideToast(); toast.onActionClick(); }}>
                {toast.actionText}
              </button>
            )}
            <button className="toast-close" onClick={hideToast} aria-label="Close">✕</button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

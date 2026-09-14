'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let icon = <Info size={18} color="#60A5FA" />;
        let borderColor = 'rgba(59, 130, 246, 0.4)';
        let bg = 'rgba(15, 23, 42, 0.96)';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={18} color="#34D399" />;
          borderColor = 'rgba(52, 211, 153, 0.4)';
          bg = 'rgba(6, 30, 20, 0.96)';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={18} color="#F87171" />;
          borderColor = 'rgba(239, 68, 68, 0.4)';
          bg = 'rgba(38, 12, 12, 0.96)';
        }

        return (
          <div
            key={toast.id}
            style={{
              background: bg,
              borderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              minWidth: '280px',
              maxWidth: '380px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
              animation: 'scaleUp 0.2s ease-out',
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#F8FAFC',
                }}
              >
                {toast.title}
              </div>
              {toast.description && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#94A3B8',
                    marginTop: '2px',
                    lineHeight: 1.4,
                  }}
                >
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

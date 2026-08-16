import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  return (
    <div className="toast-container">
      <div className={`toast-box ${type}`}>
        {type === 'error' ? (
          <AlertCircle size={18} color="#ef4444" />
        ) : type === 'info' ? (
          <Info size={18} color="#38bdf8" />
        ) : (
          <CheckCircle2 size={18} color="#facc15" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};

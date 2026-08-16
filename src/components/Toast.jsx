import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'error':
        return <AlertCircle size={18} color="#ef4444" />;
      case 'info':
        return <Info size={18} color="#38bdf8" />;
      default:
        return <CheckCircle2 size={18} color="#22c55e" />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast-box ${toastMessage.type || ''}`}>
        {getIcon()}
        <span>{toastMessage.message}</span>
      </div>
    </div>
  );
};

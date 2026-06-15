import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface NotificationBannerProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
}

export default function NotificationBanner({ message, type = 'success', onClose }: NotificationBannerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getTheme = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-50 border-red-100 text-red-800';
      case 'success':
      default:
        return 'bg-emerald-50 border-emerald-100 text-emerald-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info size={16} className="text-blue-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'success':
      default:
        return <CheckCircle2 size={16} className="text-emerald-500" />;
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 animate-slideUp px-5 py-4 rounded-xl shadow-lg border flex items-center justify-between gap-4 max-w-sm ${getTheme()}`}>
      <div className="flex items-center space-x-2.5">
        <div className="flex-shrink-0">{getIcon()}</div>
        <p className="text-xs font-bold leading-relaxed">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="text-slate-400 hover:text-slate-600 rounded-lg p-0.5 transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}

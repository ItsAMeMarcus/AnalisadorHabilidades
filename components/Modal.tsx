
import React, { useEffect, FC } from 'react';
import { XMarkIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  Icon?: FC<{ className?: string }>;
  iconColor?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, Icon, iconColor = 'text-gray-400' }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-xl shadow-lg w-full max-w-lg mx-auto flex flex-col border border-gray-700 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
                {Icon && <Icon className={`w-6 h-6 ${iconColor}`} />}
                <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto max-h-[60vh]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Modal;

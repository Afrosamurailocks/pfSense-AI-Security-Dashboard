import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-300">{message}</p>
        </div>
        <div className="bg-gray-700 px-6 py-3 flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-accent-red hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

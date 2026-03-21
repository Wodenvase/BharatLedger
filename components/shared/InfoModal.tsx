'use client';

import React from 'react';

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
};

const InfoModal: React.FC<Props> = ({ open, title, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-w-lg w-full mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="mt-4 text-gray-700 dark:text-gray-200">{children}</div>
      </div>
    </div>
  );
};

export default InfoModal;

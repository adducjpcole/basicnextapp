'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/30 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="bg-white w-full max-w-md mx-4 border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            {title}
          </p>
          <button
            onClick={onClose}
            className="text-neutral-300 hover:text-blue-500 transition-colors text-lg leading-none font-light"
          >
            ×
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

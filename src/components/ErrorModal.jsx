import React from 'react';
import { X } from 'lucide-react';

export function ErrorModal({ isOpen, onClose, errors }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Validation Errors</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {errors.map((error, index) => (
            <div
              key={index}
              className="mb-2 p-3 bg-red-50 border border-red-200 rounded"
            >
              <p className="text-sm text-red-800">
                <span className="font-semibold">Sheet:</span> {error.sheet}
              </p>
              <p className="text-sm text-red-800">
                <span className="font-semibold">Row:</span> {error.row}
              </p>
              <p className="text-sm text-red-800">
                <span className="font-semibold">Error:</span> {error.message}
              </p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
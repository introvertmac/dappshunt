import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center mb-4">
          <FaExclamationCircle className="text-red-500 text-2xl mr-2" />
          <h3 className="text-lg font-semibold">Error</h3>
        </div>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-coinbase-blue text-white px-4 py-2 rounded hover:bg-coinbase-darkBlue transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
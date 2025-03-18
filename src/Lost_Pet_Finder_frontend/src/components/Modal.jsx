import React from "react";

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg max-h-[80vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-3 text-gray-500 text-xl">
          &times;
        </button>

        {/* Modal Content */}
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

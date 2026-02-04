import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Popup = ({ isOpen, onClose, title, message, type = 'success' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden transform transition-all scale-100">
                <div className={`p-4 flex items-center justify-between ${type === 'success' ? 'bg-lavender-100' : 'bg-red-50'}`}>
                    <div className="flex items-center gap-3">
                        {type === 'success' ? (
                            <CheckCircle className={`h-6 w-6 ${type === 'success' ? 'text-lavender-600' : 'text-red-500'}`} />
                        ) : (
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        )}
                        <h3 className={`font-bold text-lg ${type === 'success' ? 'text-lavender-800' : 'text-red-800'}`}>
                            {title}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 text-center mb-6">{message}</p>
                    <button
                        onClick={onClose}
                        className={`w-full py-2 px-4 rounded-xl text-white font-medium transition-transform active:scale-95 ${type === 'success'
                                ? 'bg-lavender-600 hover:bg-lavender-700 shadow-md shadow-lavender-200'
                                : 'bg-red-500 hover:bg-red-600 shadow-md shadow-red-200'
                            }`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;

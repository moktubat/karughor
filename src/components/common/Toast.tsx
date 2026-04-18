'use client';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
}

export const Toast = ({ message, type }: ToastProps) => {
    return (
        <div
            className={`fixed bottom-6 right-6 z-9999 px-5 py-4 rounded-lg shadow-lg text-white font-medium text-sm flex items-center gap-3 animate-fade-in
        ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
            <span>{type === 'success' ? '✅' : '❌'}</span>
            {message}
        </div>
    );
};
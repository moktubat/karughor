'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '@/components/common/Toast';

type ToastType = 'success' | 'error';

interface ToastState {
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showSuccess: (msg: string) => void;
    showError: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });

        setTimeout(() => {
            setToast(null);
        }, 3500);
    }, []);

    const showSuccess = useCallback(
        (msg: string) => showToast(msg, 'success'),
        [showToast]
    );

    const showError = useCallback(
        (msg: string) => showToast(msg, 'error'),
        [showToast]
    );

    return (
        <ToastContext.Provider value={{ showSuccess, showError }}>
            {children}

            {toast && (
                <Toast message={toast.message} type={toast.type} />
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used inside ToastProvider');
    }

    return context;
};
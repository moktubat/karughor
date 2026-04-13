'use client';

import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error';

interface Toast {
    message: string;
    type: ToastType;
}

export const useToast = () => {
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    const showSuccess = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
    const showError = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);

    return { toast, showSuccess, showError };
};
'use client';

import { useEffect } from 'react';
import { useToast } from '@/providers/ToastProvider';

export default function BackendWarmup() {
    const { showError } = useToast();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (sessionStorage.getItem('backend_warmed')) return;

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 10000);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=1`, {
            signal: controller.signal,
        })
            .then(() => {
                sessionStorage.setItem('backend_warmed', '1');
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;

                if (!sessionStorage.getItem('warmup_toast_shown')) {
                    showError('Connecting to server, please wait a moment...');
                    sessionStorage.setItem('warmup_toast_shown', '1');
                }
            })
            .finally(() => clearTimeout(timeout));

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [showError]);

    return null;
}
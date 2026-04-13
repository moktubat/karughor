'use client';

import { useEffect } from 'react';

export default function BackendWarmup() {
    useEffect(() => {
        // Only fire once per browser session
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
                if (err.name !== 'AbortError') {
                    console.warn('⚠️ [Warmup] Failed:', err);
                }
            })
            .finally(() => clearTimeout(timeout));
    }, []);

    return null;
}
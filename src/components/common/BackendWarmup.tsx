'use client';

import { useEffect } from 'react';

export default function BackendWarmup() {
    useEffect(() => {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
            console.warn('⏱️ [Warmup] Request aborted after 10s');
        }, 10000);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=1`, {
            signal: controller.signal,
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
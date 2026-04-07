'use client';

import { useEffect } from 'react';

export default function BackendWarmup() {
    useEffect(() => {
        fetch('https://karughor-backend.onrender.com/api/products?limit=1').catch(() => { });
    }, []);

    return null;
}
'use client';

import { useState, useCallback, useEffect } from 'react';

export const useLikedProducts = () => {
    // Start with empty set to avoid SSR mismatch
    const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage after mount only
    useEffect(() => {
        try {
            const stored = localStorage.getItem('likedProducts');
            if (stored) {
                const parsed: string[] = JSON.parse(stored);
                setLikedProducts(new Set(parsed));
            }
        } catch {
            // ignore parse errors
        }
        setHydrated(true);
    }, []);

    // Persist on change (only after hydration)
    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem('likedProducts', JSON.stringify(Array.from(likedProducts)));
    }, [likedProducts, hydrated]);

    const toggleLike = useCallback((productId: string, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setLikedProducts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    }, []);

    const isLiked = useCallback(
        (productId: string) => likedProducts.has(productId),
        [likedProducts]
    );

    return { likedProducts, toggleLike, isLiked };
};
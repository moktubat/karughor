'use client';

import { useState, useCallback, useEffect } from 'react';

export const useLikedProducts = () => {
  // Initialize liked products from localStorage if available
  const [likedProducts, setLikedProducts] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('likedProducts');
      if (stored) {
        try {
          const parsed: number[] = JSON.parse(stored);
          return new Set(parsed);
        } catch {
          return new Set();
        }
      }
    }
    return new Set();
  });

  // Persist liked products to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('likedProducts', JSON.stringify(Array.from(likedProducts)));
    }
  }, [likedProducts]);

  // Toggle like/unlike a product
  const toggleLike = useCallback((productId: number, e?: React.MouseEvent) => {
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

  // Check if a product is liked
  const isLiked = useCallback(
    (productId: number) => likedProducts.has(productId),
    [likedProducts]
  );

  return { likedProducts, toggleLike, isLiked };
};

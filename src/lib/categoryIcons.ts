import {
    FaShoppingBag, FaBed, FaUtensils, FaTshirt, FaTag, FaLeaf, FaPaintBrush, FaHeart,
} from 'react-icons/fa';
import { MdLocalLaundryService, MdWallpaper, MdOutlineTableRows } from 'react-icons/md';
import { BsGrid3X2Gap } from 'react-icons/bs';
import { GiFlowerPot, GiSewingNeedle, GiBasket } from 'react-icons/gi';

// Map of icon name → React component
export const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    FaShoppingBag,
    FaBed,
    FaUtensils,
    FaTshirt,
    FaTag,
    FaLeaf,
    FaPaintBrush,
    FaHeart,
    MdLocalLaundryService,
    MdWallpaper,
    MdOutlineTableRows,
    BsGrid3X2Gap,
    GiFlowerPot,
    GiSewingNeedle,
    GiBasket,
    // Fallback mappings for older seeds
    GiWoodenChair: GiBasket,
};

export const getCategoryIcon = (iconName: string): React.ComponentType<{ className?: string }> => {
    return categoryIconMap[iconName] || FaTag;
};

// Slug-to-emoji fallback for display variety (optional)
export const getCategoryEmoji = (slug: string): string => {
    const map: Record<string, string> = {
        'jute-rug': '🪡',
        'ladies-bags-purses': '👜',
        'planter-baskets': '🪴',
        'laundry-baskets': '🧺',
        'shotoronji': '🎌',
        'dining-placemats': '🍽️',
        'wall-art': '🖼️',
        'three-piece-sets': '👘',
        'bed-sheets': '🛏️',
        'nakshi-kantha': '🧵',
    };
    return map[slug] || '🛍️';
};
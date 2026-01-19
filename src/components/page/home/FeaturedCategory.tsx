'use client';

import Link from 'next/link';
import { FaHome, FaTshirt, FaCouch, FaHeart, FaPuzzlePiece, FaBook } from 'react-icons/fa';

const Icons = {
  FaHome,
  FaTshirt,
  FaCouch,
  FaHeart,
  FaPuzzlePiece,
  FaBook,
};

const categories = [
  { name: 'Electronics', products: '8,9k products', icon: 'FaHome', slug: 'electronics' },
  { name: 'Fashion', products: '5,2k products', icon: 'FaTshirt', slug: 'fashion' },
  { name: 'Home', products: '3,1k products', icon: 'FaCouch', slug: 'home' },
  { name: 'Beauty', products: '2,5k products', icon: 'FaHeart', slug: 'beauty' },
  { name: 'Toys', products: '1,9k products', icon: 'FaPuzzlePiece', slug: 'toys' },
  { name: 'Books', products: '7,8k products', icon: 'FaBook', slug: 'books' },
];

const FeaturedCategory = () => {
  return (
    <section className="bg-white w-full py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-4">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-[#0B0F0E] font-grotesk font-semibold text-4xl sm:text-2xl">
            Featured Category
          </h2>
        </div>

        {/* Categories Row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-4">
          {categories.map((cat, i) => {
            const IconComponent = Icons[cat.icon as keyof typeof Icons];

            return (
              <Link
                key={i}
                href={`/category/${cat.slug}`}
                className="w-35 sm:w-25 p-6 sm:p-4 border-2 border-[#E4E9EE] rounded-xl text-center transition-all hover:border-[#C85A3A] hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="flex justify-center">
                  {IconComponent && <IconComponent className="w-10 h-10 sm:w-8 sm:h-8" />}
                </div>

                {/* Category Name */}
                <span className="block mt-2 text-[#0B0F0E] font-grotesk font-semibold text-lg leading-[140%] sm:text-base">
                  {cat.name}
                </span>

                {/* Product Count */}
                <span className="mt-1 text-[#818B9C] text-sm leading-[160%] font-grotesk hidden sm:block md:block">
                  {cat.products}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategory;

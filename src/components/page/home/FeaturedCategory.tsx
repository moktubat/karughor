'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/lib/categoryService';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { STATIC_CATEGORIES } from '@/lib/staticCategories';

const FeaturedCategory = () => {
    const { data: apiCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getAll,
        staleTime: 5 * 60 * 1000,
    });

    // Show static categories immediately; swap to real data when API responds
    const displayCategories =
        apiCategories && apiCategories.length > 0
            ? apiCategories
            : STATIC_CATEGORIES;

    return (
        <section className="bg-white w-full py-12">
            <div className="max-w-300 mx-auto px-4">
                <div className="mb-8 text-center">
                    <h2 className="text-[#0B0F0E] font-semibold text-3xl">
                        Featured Category
                    </h2>
                    <p className="text-[#818B9C] mt-2 text-sm">
                        Browse our handcrafted collections
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {displayCategories.map((cat) => {
                        const IconComponent = getCategoryIcon(cat.icon);
                        return (
                            <Link
                                key={cat._id}
                                href={`/products?category=${cat.slug}`}
                                className="group flex flex-col items-center justify-start p-4 min-h-30 border-2 border-[#E4E9EE] rounded-xl text-center transition-all duration-200 hover:border-[#C85A3A] hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FFF5F2] group-hover:bg-[#C85A3A] transition-colors duration-200 mb-3 shrink-0">
                                    <IconComponent className="w-6 h-6 text-[#C85A3A] group-hover:text-white transition-colors duration-200" />
                                </div>

                                <span className="text-[#0B0F0E] font-semibold text-sm leading-snug line-clamp-2 text-center group-hover:text-[#C85A3A] transition-colors">
                                    {cat.name}
                                </span>

                                {'subCategories' in cat && Array.isArray(cat.subCategories) && cat.subCategories.length > 0 && (
                                    <span className="mt-1 text-[#818B9C] text-xs">
                                        {cat.subCategories.length} types
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategory;
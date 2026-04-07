'use client';

import Image from 'next/image';
import hero from '@/assets/hero.png';
import { useRouter } from 'next/navigation';

const Hero = () => {

    const router = useRouter();


    return (
        <section className="bg-[#F7F7F7] overflow-hidden max-h-155">
            <div className="max-w-300 mx-auto flex items-center gap-4 px-4 md:px-0 py-10">

                {/* Left Content */}
                <div className="flex-0 basis-[60%] max-w-[60%] text-left">
                    <h1 className="text-[#0B0F0E] text-[58px] font-semibold leading-[120%] -tracking-[0.2px]">
                        Discover Bangladesh&apos;s Finest Handcrafted Treasures
                    </h1>

                    <p className="text-[#818B9C] text-[18px] font-normal leading-[160%] max-w-146.25 mt-4">
                        From <span className="font-medium text-[#0B0F0E]">Jute Rugs</span> to
                        <span className="font-medium text-[#0B0F0E]"> Nakshi Kantha</span> — every piece tells a story of Bangladeshi artistry, crafted by skilled artisans and delivered to your doorstep.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-6">
                        <button onClick={() => router.push('/products')} className="bg-[#C85A3A] text-white px-6 py-3 rounded-lg text-[18px] font-semibold transition hover:bg-[#A84830] cursor-pointer">
                            Shop Now
                        </button>
                        <button onClick={() => router.push('/products')} className="bg-white text-[#C85A3A] px-6 py-3 rounded-lg text-[18px] font-semibold border border-[#C85A3A] transition hover:bg-[#C85A3A] hover:text-white cursor-pointer">
                            View All
                        </button>
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex-0 basis-[40%] max-w-[40%] relative h-105">
                    <Image
                        src={hero}
                        alt="Fashion Collection"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'contain' }}
                    />
                </div>

            </div>
        </section>
    );
};

export default Hero;

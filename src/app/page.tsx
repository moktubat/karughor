import FeaturedCategory from "@/components/page/home/FeaturedCategory";
import Hero from "@/components/page/home/Hero";
import NewArrivals from "@/components/page/home/NewArrivals";
import ProductsSection from "@/components/page/home/ProductsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Karughor — Handicrafts Treasures from Bangladesh',
  description: 'Shop authentic handmade jute rugs, nakshi kantha, bags, bed sheets and more. Crafted by skilled Bangladeshi artisans. Cash on delivery across Bangladesh.',
};

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategory />
      <NewArrivals />
      <ProductsSection />
    </div>
  );
}

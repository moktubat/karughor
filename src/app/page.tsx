import FeaturedCategory from "@/components/page/home/FeaturedCategory";
import Hero from "@/components/page/home/Hero";
import NewArrivals from "@/components/page/home/NewArrivals";
import ProductsSection from "@/components/page/home/ProductsSection";

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

import Features from "./Features";
import TopCategories from "./TopCategories";
import HeroBanner from "./Home";
import ProductCard from "./ProductCard";
import ProductShowcase from "./ProductShowcase";
import TestimonialSlider from "./TestimonialSlider";
import Features1 from "./Features1";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="bg-[#FFF7E4]/50">

      <HeroBanner />

      <Features />

      <TopCategories />

      <ProductCard />
      <ProductShowcase />
      <TestimonialSlider />
      <Features1 />
      <Footer/>


    </div>
  );
}
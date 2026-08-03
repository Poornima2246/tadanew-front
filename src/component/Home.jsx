// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Features from "./Features";
// import TopCategories from "./TopCategories";

// import Banner1 from "../assets/Home2.png"; 
// import Banner2 from "../assets/Home1.png"; 
// import Banner3 from "../assets/Hero4.png";
 

// export default function Home() {
//   const banners = [
//     {
//       id: 0,
//       image: Banner1,
//       // Content for the 1st Slide
//       content: {
//         title: "Fuel Your Day,",
//         accent: "Naturally.",
//         description: "Premium quality almonds packed with protein, fiber, and antioxidants for clean daily energy.",
//         primaryBtn: { text: "Shop Premium Almonds", link: "/shop" },
//         secondaryBtn: { text: "Explore Products", link: "/products" }
//       }
//     },
//     {
//       id: 1,
//       image: Banner2,
//       // Content for the 2nd Slide (Different text/buttons)
//       content: {
//         title: "Fuel Your Day,",
//         accent: "Naturally.",
//         description: "Discover our new range of roasted nuts and seeds, perfect for your mid-day cravings.",
//         primaryBtn: { text: "View New Arrivals", link: "/new" },
//         secondaryBtn: { text: "Our Story", link: "/about" }
//       }
//     },
//      {
//       id: 1,
//       image: Banner3,
//       // Content for the 2nd Slide (Different text/buttons)
//       content: {
//         title: "Fuel Your Day,",
//         accent: "Naturally.",
//         description: "Discover our new range of roasted nuts and seeds, perfect for your mid-day cravings.",
//         primaryBtn: { text: "View New Arrivals", link: "/new" },
//         secondaryBtn: { text: "Our Story", link: "/about" }
//       }
//     },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [banners.length]);

//   return (
//     <div className="w-full bg-white overflow-hidden">
//       <section className="relative w-full h-[450px] md:h-[600px] lg:h-[650px] flex items-center overflow-hidden">
        
//         {/* Banner Images */}
//         {banners.map((banner, index) => (
//           <div
//             key={banner.id}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
//             }`}
//           >
//             <img
//               src={banner.image}
//               alt={`Slide ${index + 1}`}
//               className="w-full h-full object-cover"
//             />

//             {/* Render content only if it exists in the array */}
//             {banner.content && (
//               <div className="absolute inset-0 flex items-center">
//                 <div className="container mx-auto px-6 md:px-12 lg:px-20">
//                   <div className="max-w-2xl">
//                     <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
//                       {banner.content.title} <br />
//                       <span className="text-[#D80073]">{banner.content.accent}</span>
//                     </h1>
//                     <p className="mt-6 text-gray-700 text-lg md:text-xl max-w-md leading-relaxed">
//                       {banner.content.description}
//                     </p>
                    
//                     <div className="mt-10 flex flex-wrap gap-4">
//                       <Link
//                         to={banner.content.primaryBtn.link}
//                         className="bg-[#D80073] hover:bg-[#b50062] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md"
//                       >
//                         {banner.content.primaryBtn.text}
//                       </Link>
//                       <Link
//                         to={banner.content.secondaryBtn.link}
//                         className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-bold border border-gray-200 transition-all shadow-sm"
//                       >
//                         {banner.content.secondaryBtn.text}
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Navigation Dots */}
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
//           {banners.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentIndex(i)}
//               className={`h-2 rounded-full transition-all duration-300 ${
//                 i === currentIndex ? "bg-[#D80073] w-10" : "bg-gray-400/50 w-2"
//               }`}
//             />
//           ))}
//         </div>
//       </section>

//       {/* <Features/>
//       <TopCategories/> */}
//     </div>
//   );
// }



//banner image
// import Banner1 from "../assets/Home1.png";
// import Banner2 from "../assets/Hero3.png";
// import Banner3 from "../assets/Home2.png";


import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

//other components
import Features from "./Features";
import TopCategories from "./TopCategories";

//banner image
import Banner1 from "../assets/Home1.png";
import Banner2 from "../assets/Hero3.png";
import Banner3 from "../assets/Hero4.png";


export default function Home() {

  const banners = [
    {
      id: 0,
      image: Banner1,
      content: {
        title: "Fuel Your Day,",
        accent: "Naturally.",
        description:
          "Premium quality almonds packed with protein, fiber, and antioxidants for clean daily energy.",
        primaryBtn: { text: "Shop Premium Almonds", link: "/shop" },
        secondaryBtn: { text: "Explore Products", link: "/products" }
      }
    },
    {
      id: 1,
      image: Banner2,
      content: {
        title: "Healthy Snacking",
        accent: "Made Easy.",
        description:
          "Discover our new range of roasted nuts and seeds, perfect for your mid-day cravings.",
        primaryBtn: { text: "View New Arrivals", link: "/new" },
        secondaryBtn: { text: "Our Story", link: "/about" }
      }
    },
    {
      id: 2,
      image: Banner3,
      content: {
        title: "Pure Nutrition,",
        accent: "Everyday.",
        description:
          "Handpicked dry fruits delivering freshness, taste, and natural goodness in every bite.",
        primaryBtn: { text: "Shop Now", link: "/shop" },
        secondaryBtn: { text: "Learn More", link: "/about" }
      }
    }
  ];

  const slides = [...banners, banners[0]];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(true);

  const sliderRef = useRef();

  // Auto slide (SLOWER)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  // Reset when clone reached
  useEffect(() => {
    if (currentIndex === slides.length - 1) {

      setTimeout(() => {
        setTransition(false);
        setCurrentIndex(0);
      }, 1000);

      setTimeout(() => {
        setTransition(true);
      }, 1050);
    }
  }, [currentIndex, slides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex === 0) {

      setTransition(false);
      setCurrentIndex(slides.length - 1);

      setTimeout(() => {
        setTransition(true);
        setCurrentIndex(slides.length - 2);
      }, 50);

    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full bg-white overflow-hidden">

      <section className="relative w-full h-[450px] md:h-[600px] lg:h-[650px] overflow-hidden">

        {/* Slider Track */}
        <div
          ref={sliderRef}
          className={`flex h-full ${transition ? "transition-transform duration-1000 ease-in-out" : ""}`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {slides.map((banner, index) => (
            <div key={index} className="min-w-full relative">

              <img
                src={banner.image}
                alt="banner"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 md:px-12 lg:px-20">

                  <div className="max-w-2xl">

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                      {banner.content.title}
                      <br />
                      <span className="text-[#D80073]">
                        {banner.content.accent}
                      </span>
                    </h1>

                    <p className="mt-6 text-gray-700 text-lg md:text-xl max-w-md leading-relaxed">
                      {banner.content.description}
                    </p>

                    <div className="mt-10 flex gap-4">

                      <Link
                        to={banner.content.primaryBtn.link}
                        className="bg-[#D80073] hover:bg-[#b50062] text-white px-8 py-3 rounded-lg font-bold shadow-md"
                      >
                        {banner.content.primaryBtn.text}
                      </Link>

                      <Link
                        to={banner.content.secondaryBtn.link}
                        className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-bold border"
                      >
                        {banner.content.secondaryBtn.text}
                      </Link>

                    </div>

                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow z-20"
        >
          ❮
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow z-20"
        >
          ❯
        </button>


        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">

          {banners.map((_, index) => (

            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all
              ${currentIndex % banners.length === index
                ? "bg-[#D80073] scale-125"
                : "bg-white/70 hover:bg-white"}`}
            />

          ))}

        </div>

      </section>

      {/* <Features/>
      <TopCategories/> */}

    </div>
  );
}
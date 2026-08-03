 
// import React from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight, Leaf, Sprout, Flower2 } from "lucide-react";

// import MilletsImg from "../assets/Millet.png";
// import PulsesImg from "../assets/pulses.png";
// import OilsImg from "../assets/oil.png";
// import SpicesImg from "../assets/spices.png";
// import HoneyImg from "../assets/honey.png";

// // Texture style defined outside the component (reusable)
// const textureStyle = {
//   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
// };

// export default function TopCategories() {
//   const categories = [
//     { name: "Millets", image: MilletsImg },
//     { name: "Pulses", image: PulsesImg },
//     { name: "Edible Oils", image: OilsImg },
//     { name: "Spices", image: SpicesImg },
//     { name: "Honey", image: HoneyImg }
//   ];

//   return (
//     <section className="relative   px-6 md:px-12 lg:px-20 w-10/12 mx-auto rounded-3xl overflow-visible ">
//       {/* Background layer – full section size, not clipped */}
//       <div className="absolute inset-0 -z-10 pointer-events-none">
//         {/* Texture – now covers the whole section area */}
//         <div className="absolute inset-0 opacity-100" style={textureStyle} />

//         {/* Soft glows – extend beyond card edges */}
//         <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-70" />
//         <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-60" />

//         {/* Decorative leaves – more visible outside the card */}
//         <div className="absolute top-20 -left-60 text-green-700 opacity-100 transform -rotate-12">
//           <Leaf size={100} strokeWidth={1} />
//         </div>
//         <div className="absolute bottom-20 right-20 text-emerald-200 opacity-100 transform rotate-45">
//           <Sprout size={80} strokeWidth={1} />
//         </div>
//         <div className="absolute top-40 right-40 text-teal-200 opacity-100 transform rotate-90">
//           <Flower2 size={60} strokeWidth={1} />
//         </div>
//       </div>

//       {/* White content card – now separate layer */}
//       <div className="relative z-10   ">
//         <div className="py-10 px-6 md:px-12 lg:px-20">
//           {/* Header */}

//           <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
//           <div className="relative">
//             <span className="text-sm font-bold tracking-widest text-[#D80073] uppercase mb-2 block">
//               Our Collection
//             </span>

//             <h2 className="text-5xl md:text-6xl font-serif text-[#4A1D1F] relative z-10">
//               Shop by <span className="italic text-[#A22161]">Category</span>
//             </h2>

//             {/* underline */}
//             <svg className="w-48 h-3 mt-2" viewBox="0 0 200 20" fill="none">
//               <path
//                 d="M5 15C30 12 60 10 100 10C140 10 170 12 195 15"
//                 stroke="#D80073"
//                 strokeWidth="6"
//                 strokeLinecap="round"
//                 className="opacity-30"
//               />
//             </svg>
//           </div>

//           <Link
//             to="/shop"
//             className="group flex items-center gap-3 bg-[#A22161] text-white px-8 py-4 rounded-full font-bold hover:bg-[#851b4f] transition-all shadow-lg hover:shadow-pink-200"
//           >
//             View All Range
//             <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
//           </Link>
//         </div>

//           {/* Category grid */}
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//             {categories.map((cat, index) => (
//               <Link
//                 key={index}
//                 to={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
//                 className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 transition-all duration-500 overflow-hidden text-center 
//                            hover:border-[#D80073]/30 hover:shadow-[0_20px_40px_rgba(216,0,115,0.12)] hover:-translate-y-2"
//               >
//                 {/* Image Container */}
//                 <div className="h-40 md:h-60 overflow-hidden bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
//                   <img
//                     src={cat.image}
//                     alt={cat.name}
//                     className="w-full h-full object-fit  "
//                   />
//                 </div>

//                 {/* Label */}
//                 <div className="py-4 bg-white/90 backdrop-blur-sm transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-50">
//                   <span className="font-bold text-gray-700 transition-colors duration-300 group-hover:text-[#D80073]">
//                     {cat.name}
//                   </span>
//                 </div>

//                 {/* Subtle hover border overlay */}
//                 <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D80073]/10 rounded-2xl pointer-events-none transition-all duration-500" />
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


 
 


// TopCategories.jsx - Updated version

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Sprout, Flower2 } from "lucide-react";

import MilletsImg from "../assets/Millet.png";
import PulsesImg from "../assets/pulses.png";
import OilsImg from "../assets/oil.png";
import SpicesImg from "../assets/spices.png";
import HoneyImg from "../assets/honey.png";

const textureStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
};

export default function TopCategories() {
  const categories = [
    { name: "Millets", image: MilletsImg, slug: "millets" },
    { name: "Pulses", image: PulsesImg, slug: "pulses" },
    { name: "Edible Oils", image: OilsImg, slug: "edible-oils" },
    { name: "Spices", image: SpicesImg, slug: "spices" },
    { name: "Honey", image: HoneyImg, slug: "honey" }
  ];

  return (
    <section className="relative  w-12/12 container mx-auto rounded-3xl overflow-visible">
      {/* Background layer */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 opacity-100" style={textureStyle} />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-20 -left-60 text-green-700 opacity-100 transform -rotate-12">
          <Leaf size={100} strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 right-20 text-emerald-200 opacity-100 transform rotate-45">
          <Sprout size={80} strokeWidth={1} />
        </div>
        <div className="absolute top-40 right-40 text-teal-200 opacity-100 transform rotate-90">
          <Flower2 size={60} strokeWidth={1} />
        </div>
      </div>

      {/* Content Card */}
      <div className="relative z-10">
        <div className="py-10  ">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
            <div className="relative">
              <span className="text-sm font-bold tracking-widest text-[#D80073] uppercase mb-2 block">
                Our Collection
              </span>
              <h2 className="text-5xl md:text-6xl font-serif text-[#4A1D1F] relative z-10">
                Shop by <span className="italic text-[#A22161]">Category</span>
              </h2>
              <svg className="w-48 h-3 mt-2" viewBox="0 0 200 20" fill="none">
                <path
                  d="M5 15C30 12 60 10 100 10C140 10 170 12 195 15"
                  stroke="#D80073"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="opacity-30"
                />
              </svg>
            </div>

            <Link
              to="/shop"
              className="group flex items-center gap-3 bg-[#A22161] text-white px-8 py-4 rounded-full font-bold hover:bg-[#851b4f] transition-all shadow-lg hover:shadow-pink-200"
            >
              View All Range
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/shop?category=${cat.slug}`}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 transition-all duration-500 overflow-hidden text-center 
                           hover:border-[#D80073]/30 hover:shadow-[0_20px_40px_rgba(216,0,115,0.12)] hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="h-40 md:h-60 overflow-hidden bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"   // Fixed: object-cover instead of object-fit
                  />
                </div>

                {/* Label */}
                <div className="py-4 bg-white/90 backdrop-blur-sm transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-50">
                  <span className="font-bold text-gray-700 transition-colors duration-300 group-hover:text-[#D80073]">
                    {cat.name}
                  </span>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D80073]/10 rounded-2xl pointer-events-none transition-all duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
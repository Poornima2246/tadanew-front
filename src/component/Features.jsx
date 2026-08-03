import React from "react";
import { Leaf, Star } from "lucide-react";

export default function Features({ overlap = false }) {
  const features = [
    {
      icon: <Leaf className="text-[#A22161]" size={28} />,
      title: "100% Organic food",
      desc: "100% healthy & Fresh food.",
    },
    {
      icon: <span className="text-[#A22161] font-bold text-lg">0%</span>,
      title: "Zero Preservatives",
      desc: "100% healthy & Fresh food.",
    },
    {
      icon: <Star className="text-[#A22161] " size={28} />,
      title: "Customer Feedback",
      desc: "Our happy customer",
    },
  ];

  return (
 
    
    <div
      className={`relative z-30 px-4 md:px-10 lg:px-20    ${
        overlap ? "-mt-16 md:-mt-24 lg:-mt-28" : "mt-10"
      }`}
    >
      <div className="max-w-8xl mx-auto bg-[#F2D8E1] rounded-xl  flex flex-col md:flex-row items-center justify-around py-10   gap-8  ">

        {features.map((item, index) => (
          <div key={index} className="flex items-center gap-4 w-full md:w-auto">

            {/* Icon */}
            <div className="w-16 h-16 flex-shrink-0 bg-[#FFF7E4] rounded-full flex items-center justify-center">
              {item.icon}
            </div>

            {/* Text */}
            <div>
              <h3 className="text-xl font-bold text-[#A22161] ">
                {item.title}
              </h3>
              <p className="text-[#A22161]/60 text-sm">
                {item.desc}
              </p>
            </div>

            {/* Divider */}
            {index !== features.length - 1 && (
              <div className="hidden lg:block h-12 w-[1px] bg-gray-200 ml-10" />
            )}
          </div>
        ))}

      </div>
    </div>
   
  );
}
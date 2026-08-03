import React from 'react';
import { Truck, Headset, Lock, Box } from 'lucide-react';

const features = [
  {
    icon: <Truck className="text-pink-600" size={28} />,
    title: "Free Shipping",
    desc: "Free shipping on all your order"
  },
  {
    icon: <Headset className="text-pink-600" size={28} />,
    title: "Customer Support 24/7",
    desc: "Instant access to Support"
  },
  {
    icon: <Lock className="text-pink-600" size={28} />,
    title: "100% Secure Payment",
    desc: "We ensure your money is safe"
  },
  {
    icon: <Box className="text-pink-600" size={28} />,
    title: "Money-Back Guarantee",
    desc: "30 Days Money-Back Guarantee"
  }
];

const FeaturesBar = () => {
  return (
    <div className="relative z-10 px-4 py-16 bg-white">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl py-8 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="shrink-0">{f.icon}</div>
            <div>
              <h4 className="text-sm font-bold text-gray-800 leading-tight">
                {f.title}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesBar;
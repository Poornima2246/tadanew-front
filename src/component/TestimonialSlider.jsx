import React from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Priya. R",
    role: "Customer",
    text: "Very fresh almonds and great taste. Perfect for daily healthy snacks. Will definitely reorder every month.",
    stars: 5,
  },
  {
    id: 2,
    name: "Arjun. K",
    role: "Customer",
    text: "Quality is excellent and packaging feels premium. Highly recommended for anyone who values real nutrition.",
    stars: 5,
  },
  {
    id: 3,
    name: "Meena. S",
    role: "Customer",
    text: "My kids love these almonds. Super crunchy and incredibly fresh. Fast delivery and great value for money!",
    stars: 5,
  },
];

const TestimonialSlider = () => {
  return (
    <section className="bg-[#F2D8E1] py-16 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            What Our Customers Say
          </h2>
          <div className="flex gap-4">
            <button className="p-3 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <button className="p-3 rounded-full bg-[#ff4db8] text-white hover:bg-[#e639a3] transition-colors shadow-sm">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-8 rounded-xl shadow-sm flex flex-col justify-between"
            >
              <div>
                <Quote className="text-[#ffb7e1] mb-4 rotate-180" size={32} fill="currentColor" />
                <p className="text-gray-600 leading-relaxed mb-8">
                  {item.text}
                </p>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  {/* Avatar Placeholder */}
                  <div className="w-12 h-12 rounded-full bg-gray-300" />
                  <div>
                    <h4 className="font-bold text-gray-800 leading-none">{item.name}</h4>
                    <span className="text-sm text-gray-400">{item.role}</span>
                  </div>
                </div>
                
                {/* Star Rating */}
                <div className="flex gap-0.5">
                  {[...Array(item.stars)].map((_, i) => (
                    <span key={i} className="text-orange-400 text-lg">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
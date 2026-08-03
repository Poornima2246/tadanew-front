import React from 'react';
import { Facebook, Instagram, Youtube, Twitter, ChevronUp, Search } from 'lucide-react';

// Replace these paths with your actual image file paths
import UpperPaperEdge from '../assets/footerimg.png';
import LowerPaperEdge from '../assets/footerimg.png';

const Footer = () => {
  return (
    <footer className="relative bg-[#A32062]  pb-12 overflow-hidden">
      {/* Upper Paper Effect Image */}
      <div className="absolute -top-3 left-0 w-full leading-[0] z-20">
        <img 
          src={UpperPaperEdge} 
          alt="" 
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-40 relative z-10">
        {/* Back to Top */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1 mx-auto text-sm font-medium text-white mb-16 hover:text-white transition-colors"
        >
          Back to Top <ChevronUp size={16} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Links Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              {['Home', 'Products', 'Our Story', 'Contact'].map(link => (
                <a key={link} href="#" className="block text-sm font-medium text-white hover:text-pink-600 transition-colors">{link}</a>
              ))}
            </div>
            <div className="space-y-3">
              {['Terms & Conditions', 'Return and Cancellation', 'Security and Privacy Policy', 'Payment Details'].map(link => (
                <a key={link} href="#" className="block text-sm font-medium text-white hover:text-pink-600 transition-colors">{link}</a>
              ))}
            </div>
            <div className="space-y-3">
              {['Contact Us', "FAQ's"].map(link => (
                <a key={link} href="#" className="block text-sm font-medium text-white hover:text-pink-600 transition-colors">{link}</a>
              ))}
            </div>
          </div>

          {/* Logo Section */}
          <div className="flex justify-center lg:justify-end">
             <h1 className="text-8xl font-serif italic text-[#9d174d] opacity-90 select-none">tadaa</h1>
          </div>
        </div>

        {/* Bottom Row: Newsletter & Socials */}
      <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-pink-200 pt-10">
  <div className="w-full max-w-md">
    <h3 className="font-bold text-white mb-4 text-lg">Sign Up To Get Updates</h3>
    <div className="relative flex items-center">
      <Search className="absolute left-4 text-gray-400" size={18} />
      <input 
        type="email" 
        placeholder="Enter the E-mail Address" 
        /* Added bg-white and text-gray-900 below */
        className="w-full py-3 pl-12 pr-32 rounded-full border-none bg-white text-gray-900 focus:ring-2 focus:ring-pink-400 text-sm shadow-sm"
      />
      <button className="absolute right-1 bg-[#d1107a] text-white px-8 py-2 rounded-full font-bold text-sm hover:bg-[#b00d66] transition-colors">
        Subscribe
      </button>
    </div>
  </div>

  <div className="flex gap-6 text-white">
    <Facebook className="cursor-pointer hover:text-pink-600 transition-colors" size={24} />
    <Instagram className="cursor-pointer hover:text-pink-600 transition-colors" size={24} />
    <Youtube className="cursor-pointer hover:text-pink-600 transition-colors" size={24} />
    <Twitter className="cursor-pointer hover:text-pink-600 transition-colors" size={24} />
  </div>
</div>
      </div>

      {/* Lower Paper Effect Image */}
      {/* <div className="absolute -bottom-14 left-0 w-full leading-[0] z-20">
        <img 
          src={LowerPaperEdge} 
          alt="" 
          className="w-full h-auto object-cover"
        />
      </div> */}
    </footer>
  );
};

export default Footer;
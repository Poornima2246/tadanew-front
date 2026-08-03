// import React from "react";
// import { Check } from "lucide-react";

// const steps = [
//   { id: "01", name: "Order received" },
//   { id: "02", name: "Processing" },
//   { id: "03", name: "On the way" },
//   { id: "04", name: "Delivered" },
// ];

// export default function OrderTimeline({ status }) {
//   // Mapping the backend status to our step names for logic
//   const currentIndex = steps.findIndex((step) => step.name === status);

//   return (
//     <div className="w-full py-12 px-4 bg-white">
//       <div className="relative flex items-center justify-between max-w-4xl mx-auto">
        
//         {/* Progress Track Background */}
//         <div className="absolute top-[20px] left-0 w-full h-[6px] bg-gray-100" />

//         {/* Active Pink Line - Matches the "Processing" stage in the image */}
//         <div
//           className="absolute top-[20px] left-0 h-[6px] bg-[#ff4d94] transition-all duration-700 ease-in-out"
//           style={{
//             // Calculations to ensure the line stops exactly at the center of the current node
//             width: `${(currentIndex / (steps.length - 1)) * 100}%`,
//           }}
//         />

//         {/* Steps */}
//         {steps.map((step, index) => {
//           const isCompleted = index < currentIndex;
//           const isCurrent = index === currentIndex;
//           const isPending = index > currentIndex;

//           return (
//             <div key={step.id} className="relative z-10 flex flex-col items-center flex-1">
              
//               {/* Circle Marker */}
//               <div
//                 className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 bg-white ${
//                   isCompleted || isCurrent
//                     ? "border-[#ff4d94] text-[#ff4d94]"
//                     : "border-pink-200 border-dashed text-pink-200"
//                 } ${isCompleted ? "bg-[#ff4d94] text-white" : ""}`}
//               >
//                 {isCompleted ? (
//                   <Check className="w-5 h-5 stroke-[4px]" />
//                 ) : (
//                   <span className="text-xs font-bold">{step.id}</span>
//                 )}
//               </div>

//               {/* Label */}
//               <div className="mt-3">
//                 <p
//                   className={`text-sm font-semibold transition-colors duration-300 ${
//                     isCurrent || isCompleted ? "text-gray-800" : "text-gray-400"
//                   }`}
//                 >
//                   {step.name}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Check } from "lucide-react";

const steps = [
  { id: "01", name: "Pending" },
  { id: "02", name: "Confirmed" },
  { id: "03", name: "Processing" },
  { id: "04", name: "Shipped" },
  { id: "05", name: "Delivered" },
];

const getStepIndex = (status) => {
  if (!status) return 0;
  const s = status.toLowerCase();
  if (s === "pending") return 0;
  if (s === "confirmed") return 1;
  if (s === "processing" || s === "packed") return 2;
  if (s === "shipped") return 3;
  if (s === "delivered") return 4;
  return 0;
};

export default function OrderTimeline({ order }) {
  const currentIndex = getStepIndex(order?.orderStatus);
  const billing = order?.shippingAddress || {};
  const products = order?.products || [];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white font-sans text-gray-700">
      
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Billing Address */}
        <div className="md:col-span-2 border border-gray-100 rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4 border-b pb-2">
            Billing Address
          </h3>
          <div className="space-y-1">
            <p className="font-bold text-lg text-gray-800">
              {billing.name || "—"}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              {billing.street || ""}, {billing.city || ""}, {billing.state || ""} - {billing.zipCode || ""}
            </p>
            <div className="pt-4 space-y-1">
              <p className="text-xs text-gray-400 uppercase font-semibold">Phone</p>
              <p className="text-sm">{billing.phone || "—"}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border border-gray-100 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between border-b pb-4 mb-4">
            <div className="text-left">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Status:</p>
              <p className="font-bold uppercase text-xs text-[#ed4d97]">
                {order?.orderStatus || "—"}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm border-b pb-4 mb-4">
            <div className="flex justify-between text-gray-500">
              <span>Items:</span>
              <span className="font-bold text-gray-800">{products.length}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span className="font-bold text-gray-800">Free</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total</span>
            <span className="text-2xl font-bold text-[#ed4d97]">
              ₹{order?.totalAmount?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="relative flex items-center justify-between mb-16 px-4">
        {/* Background Gray Line */}
        <div className="absolute top-[20px] left-0 w-full h-[6px] bg-gray-100 rounded-full" />

        {/* Progress Pink Line */}
        <div
          className="absolute top-[20px] left-0 h-[6px] bg-[#ed4d97] transition-all duration-700 rounded-full"
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, index) => {
          // Logic: If the status is "Delivered" (index 4), we want all steps to show as "Completed"
          const isDelivered = currentIndex === steps.length - 1;
          const isCompleted = index < currentIndex || (isDelivered && index === currentIndex);
          const isCurrent = index === currentIndex && !isDelivered;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center flex-1">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all 
                  ${isCompleted || isCurrent ? "border-[#ed4d97]" : "border-pink-200 border-dashed bg-white"}
                  ${isCompleted ? "bg-[#ed4d97]" : "bg-white"}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white stroke-[3px]" />
                ) : (
                  <span
                    className={`text-xs font-bold ${
                      isCurrent ? "text-[#ed4d97]" : "text-pink-200"
                    }`}
                  >
                    {step.id}
                  </span>
                )}
              </div>

              <p
                className={`mt-3 text-[10px] md:text-xs font-bold uppercase tracking-tight ${
                  index <= currentIndex ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {step.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* PRODUCTS TABLE */}
      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((item, index) => (
              <tr key={index} className="text-sm">
                <td className="px-4 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center border border-gray-100 overflow-hidden">
                    <img
                      src={item.image || "/api/placeholder/40/40"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-gray-600">{item.name}</span>
                </td>
                <td className="px-4 py-4 font-semibold">₹{item.price?.toFixed(2)}</td>
                <td className="px-4 py-4 text-gray-500 font-medium">x{item.quantity}</td>
                <td className="px-4 py-4 text-right font-bold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
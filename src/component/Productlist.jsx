 

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroImage from "../assets/jaggery.png";
import OrganicBadge from "../assets/jaggery.png";
import axios from "axios";

export default function Productlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      console.time('productFetch'); // Start timing the fetch and set process
      try {
        const response = await axios.get("http://localhost:5000/api/products?limit=4");

        const productsData = Array.isArray(response?.data) ? response.data : [];

        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
        console.timeEnd('productFetch'); // End timing after state update and loading complete
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50">
      {/* Hero Section */}
      {/* <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-3xl container **: p-8 md:p-12 shadow-lg h-96 flex flex-col justify-center items-center text-center">
            <img
              src={HeroImage}
              alt="Organic Jaggery"
              className="w-full h-full mx-6 mt-6 object-cover rounded-2xl"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
              Pure & Natural Organic Jaggery
            </h1>
            <p className="text-lg text-green-800 mb-6 max-w-2xl">
              Experience the authentic taste of traditionally crafted jaggery,
              made with love and care for your wellness.
            </p>
            <Link
              to="/shop"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            We're committed to bringing you the purest organic products with
            complete transparency and quality assurance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-64">
            <div className="bg-yellow-50 rounded-xl p-6 text-center shadow-md h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                100% Organic
              </h3>
              <p className="text-gray-600">
                Certified organic farming practices
              </p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 text-center shadow-md h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👨‍🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Farm-to-Table
              </h3>
              <p className="text-gray-600">
                Harvested at peak freshness for maximum nutrition.
              </p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 text-center shadow-md h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🥇</span>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Lab Tested
              </h3>
              <p className="text-gray-600">
                Every batch tested for purity and quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 py-16 md:px-8 lg:px-16 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-4">
            Our Premium Products
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Discover our range of farm-fresh organic products that nourish your
            body and soul.
          </p>

          {error ? (
            <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg h-40 flex items-center justify-center">
              {error}
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      <div className="h-10 w-10 bg-green-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center h-40 flex items-center justify-center">
              No products available
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="h-60 overflow-hidden flex items-center justify-center bg-yellow-50">
                      <img
                        src={product.image?.cdn_url || product.image?.url}
                        alt={product.name}
                        className="w-full h-full mx-6 mt-6 object-cover rounded-2xl"
                      />
                    </div>

                    {/* space between */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold h-15 text-green-800  mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm mb-4 t opacity-40">
                        organic&nbsp;{product.category}
                      </p>

                      <div className="flex justify-between items-center">
                        <p className="text-green-600 font-medium">
                          ${product.price}
                        </p>
                        <button className="h-10 w-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition duration-300">
                          <span className="text-green-700 text-xl -mt-1.5">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  to="/shop"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                >
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center h-64 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Sweet Community</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, recipes, and
            health tips.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="py-3 px-6 rounded-lg text-gray-800 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-green-100"
            />
            <button className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-semibold py-3 px-8 rounded-lg transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
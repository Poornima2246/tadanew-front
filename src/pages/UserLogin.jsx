 


//  import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../pages/AuthContext';
// import { GoogleLogin } from '@react-oauth/google';

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();

//   const from = location.state?.from?.pathname || '/user';

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       console.log('Attempting login with:', formData.email);
      
//       const response = await fetch('https://tadaa-bacend.onrender.com/api/users/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       console.log('Login response:', data);

//       if (data.success) {
//         console.log('Login successful, storing token and user data');
//         login(data.user, data.token);
//         navigate(from, { replace: true });
//       } else {
//         setError(data.message);
//         console.log('Login failed:', data.message);
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google Login Handler
//   const handleGoogleSuccess = async (credentialResponse) => {
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('https://tadaa-bacend.onrender.com/api/users/google-login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ credential: credentialResponse.credential }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         login(data.user, data.token);
//         navigate(from, { replace: true });
//       } else {
//         setError(data.message || 'Google login failed');
//       }
//     } catch (err) {
//       console.error('Google login error:', err);
//       setError('Google login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleError = () => {
//     setError('Google sign-in was cancelled or failed. Please try again.');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md mt-16">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Login to your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Or{' '}
//           <Link
//             to="/register"
//             className="font-medium text-purple-600 hover:text-purple-500"
//           >
//             create a new account
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {/* Email/Password Form */}
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <Link
//                   to="/forgot-password"
//                   className="font-medium text-purple-600 hover:text-purple-500"
//                 >
//                   Forgot your password?
//                 </Link>
//               </div> 
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
//               >
//                 {loading ? 'Logging in...' : 'Login'}
//               </button>
//             </div>
//           </form>

//           {/* Divider */}
//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
//               </div>
//             </div>

//             {/* Google Login Button */}
//             <div className="mt-6">
//               <GoogleLogin
//                 onSuccess={handleGoogleSuccess}
//                 onError={handleGoogleError}
//                 useOneTap={false}
//                 theme="outline"
//                 size="large"
//                 width="100%"
//                 text="signin_with"
//                 shape="rectangular"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../pages/AuthContext';
// import { GoogleLogin } from '@react-oauth/google';
// import { Leaf, Mail, Lock, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();

//   const from = location.state?.from?.pathname || '/user';

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('https://tadaa-bacend.onrender.com/api/users/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (data.success) {
//         login(data.user, data.token);
//         navigate(from, { replace: true });
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('https://tadaa-bacend.onrender.com/api/users/google-login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ credential: credentialResponse.credential }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         login(data.user, data.token);
//         navigate(from, { replace: true });
//       } else {
//         setError(data.message || 'Google login failed');
//       }
//     } catch (err) {
//       setError('Google login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleError = () => {
//     setError('Google sign-in was cancelled or failed. Please try again.');
//   };

//   return (
//     <div className=" h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center my-auto    ">
//       {/* Decorative Elements */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
//       </div>

//       <div className="relative w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
//         {/* Left Panel - Branding & Benefits */}
//         <div className="w-full md:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
//           <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
//           <div>
//             <div className="flex items-center gap-2 mb-8">
//               <Leaf className="w-8 h-8 text-green-300" />
//               <span className="text-2xl font-bold tracking-tight">EcoHarvest</span>
//             </div>
            
//             <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
//               Welcome Back to<br />
//               <span className="text-green-200">Organic Living</span>
//             </h1>
//             <p className="text-green-100 text-lg mb-8 opacity-90">
//               Continue your journey towards a healthier, sustainable lifestyle.
//             </p>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//               <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
//                 <ShoppingBag className="w-5 h-5" />
//               </div>
//               <div>
//                 <p className="font-semibold">100% Organic Products</p>
//                 <p className="text-sm text-green-200">Certified organic and sustainably sourced</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//               <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
//                 <Sparkles className="w-5 h-5" />
//               </div>
//               <div>
//                 <p className="font-semibold">Farm to Table</p>
//                 <p className="text-sm text-green-200">Fresh produce delivered directly to you</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 flex items-center gap-4 text-sm text-green-200">
//             <span>🌱 Sustainable</span>
//             <span className="w-1 h-1 bg-green-300 rounded-full"></span>
//             <span>🌿 Eco-Friendly</span>
//             <span className="w-1 h-1 bg-green-300 rounded-full"></span>
//             <span>🥗 Healthy</span>
//           </div>
//         </div>

//         {/* Right Panel - Login Form */}
//         <div className="w-full md:w-1/2 p-8 md:p-12">
//           <div className="max-w-sm mx-auto">
//             <div className="mb-8">
//               <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
//               <p className="text-gray-500">
//                 Don't have an account?{' '}
//                 <Link
//                   to="/register"
//                   className="text-green-600 hover:text-green-700 font-semibold transition-colors"
//                 >
//                   Join Green Community
//                 </Link>
//               </p>
//             </div>

//             <form className="space-y-5" onSubmit={handleSubmit}>
//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
//                   <span className="text-red-400">⚠️</span>
//                   {error}
//                 </div>
//               )}

//               <div className="space-y-1">
//                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <Mail className="w-4 h-4 text-gray-400" />
//                   Email Address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="you@example.com"
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-gray-50/50"
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <Lock className="w-4 h-4 text-gray-400" />
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-gray-50/50"
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                   />
//                   Remember me
//                 </label>
//                 <Link
//                   to="/forgot-password"
//                   className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-green-600/30 disabled:opacity-50"
//               >
//                 {loading ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 ) : (
//                   <>
//                     Sign In
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Divider */}
//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white text-gray-500">or continue with</span>
//               </div>
//             </div>

//             {/* Google Login */}
//             <div className="flex justify-center">
//               <GoogleLogin
//                 onSuccess={handleGoogleSuccess}
//                 onError={handleGoogleError}
//                 useOneTap={false}
//                 theme="outline"
//                 size="large"
//                 width="100%"
//                 text="signin_with"
//                 shape="rectangular"
//                 logo_alignment="center"
//               />
//             </div>

//             <p className="mt-6 text-xs text-center text-gray-400">
//               By signing in, you agree to our{' '}
//               <Link to="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
//               {' '}and{' '}
//               <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Leaf, Mail, Lock, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/user';

  // Check API health on component mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch(' https://tadaa-bacend.onrender.com/api/test');
        const data = await response.json();
        console.log('✅ API Status:', data);
        setApiStatus('connected');
      } catch (err) {
        console.error('❌ API Connection Error:', err);
        setApiStatus('error');
        setError('Cannot connect to server. Please try again later.');
      }
    };
    checkAPI();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(' https://tadaa-bacend.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        login(data.user, data.token);
        navigate(from, { replace: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      console.log('🔵 Sending Google login request...');
      
      const response = await fetch(' https://tadaa-bacend.onrender.com/api/users/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          credential: credentialResponse.credential 
        }),
      });

      console.log('📊 Response status:', response.status);
      
      // Try to parse response
      let data;
      const textResponse = await response.text();
      console.log('📄 Raw response:', textResponse);
      
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Server returned invalid response');
      }

      if (response.ok && data.success) {
        console.log('✅ Google login successful');
        login(data.user, data.token);
        navigate(from, { replace: true });
      } else {
        console.error('❌ Login failed:', data.message);
        setError(data.message || 'Google login failed');
      }
    } catch (err) {
      console.error('❌ Google login error:', err);
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed. Please try again.');
  };

  // If API is not connected, show error
  if (apiStatus === 'error') {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Connection Error</h2>
          <p className="text-gray-600">Cannot connect to the server. Please check your internet connection.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center my-auto">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Leaf className="w-8 h-8 text-green-300" />
              <span className="text-2xl font-bold tracking-tight">EcoHarvest</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Welcome Back to<br />
              <span className="text-green-200">Organic Living</span>
            </h1>
            <p className="text-green-100 text-lg mb-8 opacity-90">
              Continue your journey towards a healthier, sustainable lifestyle.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">100% Organic Products</p>
                <p className="text-sm text-green-200">Certified organic and sustainably sourced</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Farm to Table</p>
                <p className="text-sm text-green-200">Fresh produce delivered directly to you</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-green-200">
            <span>🌱 Sustainable</span>
            <span className="w-1 h-1 bg-green-300 rounded-full"></span>
            <span>🌿 Eco-Friendly</span>
            <span className="w-1 h-1 bg-green-300 rounded-full"></span>
            <span>🥗 Healthy</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-sm mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
              <p className="text-gray-500">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  Join Green Community
                </Link>
              </p>
              {apiStatus === 'checking' && (
                <p className="text-sm text-gray-400 mt-2">⏳ Connecting to server...</p>
              )}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <span className="text-red-400">⚠️</span>
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-gray-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-gray-50/50"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || apiStatus === 'checking'}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-green-600/30 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                width="100%"
                text="signin_with"
                shape="rectangular"
                logo_alignment="center"
              />
            </div>

            <p className="mt-6 text-xs text-center text-gray-400">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
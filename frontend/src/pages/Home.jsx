import { Link, useNavigate } from 'react-router-dom';
import { Car, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <nav className="border-b border-gray-700 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
                        <img 
                            src="/download-2.png" 
                            alt="Logo" 
                            className="h-8 sm:h-10 w-auto group-hover:scale-105 transition-transform" 
                        />
                        <span className="text-xl sm:text-2xl font-bold text-white">Rent<span className="text-blue-500">A</span>Car</span>
                    </Link>
                    
                    <div className="flex gap-2 sm:gap-4">
                        {!user ? (
                            <>
                                <Link 
                                    to="/register" 
                                    className="px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base text-gray-300 hover:text-white transition-colors font-medium cursor-pointer"
                                >
                                    Sign Up
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer"
                                >
                                    Login
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/customers')}
                                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
                            >
                                Dashboard
                                <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28 text-center">
                <div className="mb-6 sm:mb-8 animate-bounce">
                    <div className="inline-flex p-3 sm:p-4 bg-blue-500/10 rounded-full">
                        <Car size={32} className="sm:w-12 sm:h-12 text-blue-500" />
                    </div>
                </div>
                
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2">
                    <span className="text-white">Rent the</span>
                    <br className="block sm:hidden" />
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"> Perfect Car</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                    Choose from our wide selection of premium vehicles. Easy booking, competitive prices, and 24/7 support.
                </p>
                
                <div className="flex gap-3 sm:gap-4 justify-center flex-wrap px-4">
                    <button
                        onClick={() => navigate(user ? '/customers' : '/register')}
                        className="group px-5 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base md:text-lg rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
                    >
                        {user ? 'Go to Dashboard' : 'Get Started'}
                        <ArrowRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    {!user && (
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 sm:px-8 py-2.5 sm:py-3 border border-gray-600 text-gray-300 text-sm sm:text-base md:text-lg rounded-xl font-semibold hover:border-gray-400 hover:text-white transition-all cursor-pointer"
                        >
                            Sign In
                        </button>
                    )}
                </div>
                
                <div className="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-10 border-t border-gray-800">
                    <div className="flex justify-center gap-6 sm:gap-8 md:gap-12 flex-wrap px-4">
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-white">50+</div>
                            <div className="text-xs sm:text-sm text-gray-500">Vehicles</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-white">10k+</div>
                            <div className="text-xs sm:text-sm text-gray-500">Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-white">24/7</div>
                            <div className="text-xs sm:text-sm text-gray-500">Support</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
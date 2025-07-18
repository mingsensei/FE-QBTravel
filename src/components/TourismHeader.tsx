import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Calendar, Utensils, Camera, Info, Phone, Home, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const TourismHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    navigate('/login'); // Chuyển hướng về trang login sau khi logout
  };

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Destinations', href: '/destinations', icon: MapPin },
    { name: 'Map', href: '/map', icon: MapPin },
    { name: 'Experiences', href: '/experiences', icon: Camera },
    { name: 'Products', href: '/products', icon: Gift },
    { name: 'Itinerary', href: '/itinerary', icon: Calendar },
    { name: 'About Quang Binh', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white backdrop-blur-sm shadow-lg border-b border-gray-100' // Sửa bg-white/95 thành bg-white
          : 'bg-white backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Quang Binh
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Travel Map</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-grow">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 whitespace-nowrap"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {isLoggedIn ? (
              <>
                <Button
                  className="hidden sm:flex bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                  onClick={() => navigate('/user')}
                >
                  Profile
                </Button>
                <Button
                  className="hidden sm:flex bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                className="hidden sm:flex bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                onClick={() => navigate('/login')}
              >
                Plan Your Trip
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white backdrop-blur-sm">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </a>
              ))}
              <div className="px-4 pt-4">
                {isLoggedIn ? (
                  <>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-primary-glow text-white font-semibold py-3 rounded-full shadow-lg"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/user');
                      }}
                    >
                      Profile
                    </Button>
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-full shadow-lg mt-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-primary-glow text-white font-semibold py-3 rounded-full shadow-lg"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/login');
                    }}
                  >
                    Plan Your Trip
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default TourismHeader;
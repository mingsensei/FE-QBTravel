import React from 'react';
import { MapPin, Mail, Phone, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';

const TourismFooter = () => {
  const quickLinks = [
    { name: 'Destinations', href: '/destinations' },
    { name: 'Interactive Map', href: '/map' },
    { name: 'Local Cuisine', href: '/cuisine' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Quang Binh
                </h2>
                <p className="text-sm text-gray-600">Travel Map</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Discover the natural wonders and rich heritage of Quang Binh province, 
              from UNESCO World Heritage sites to pristine beaches and stunning caves.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href="mailto:info@quangbinhtravel.com" className="text-gray-900 hover:text-primary transition-colors">
                    info@quangbinhtravel.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a href="tel:+84232123456" className="text-gray-900 hover:text-primary transition-colors">
                    +84 232 123 456
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-gray-900">
                    Dong Hoi City, Quang Binh Province, Vietnam
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`p-3 bg-gray-100 rounded-full text-gray-600 ${social.color} transition-all duration-200 hover:bg-white hover:shadow-lg transform hover:scale-110`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Subscribe to our newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-r-lg hover:bg-primary-glow transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © 2024 Quang Binh Travel Map. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-gray-600 hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TourismFooter;
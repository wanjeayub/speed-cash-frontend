import React from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Loan Calculator", path: "/calculator" },
    { name: "FAQs", path: "/faqs" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const legalLinks = [
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Cookie Policy", path: "/cookies" },
    { name: "Data Protection", path: "/data-protection" },
    { name: "Complaints", path: "/complaints" },
  ];

  const socialLinks = [
    { icon: FiFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FiInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const contactInfo = [
    { icon: FiPhone, text: "+254 700 123 456", href: "tel:+254700123456" },
    {
      icon: FiMail,
      text: "info@speedycash.co.ke",
      href: "mailto:info@speedycash.co.ke",
    },
    { icon: FiMapPin, text: "Nairobi, Kenya", href: "https://maps.google.com" },
    { icon: FiClock, text: "Mon-Fri: 8am - 6pm" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Speedy Cash Solutions
            </h3>
            <p className="text-sm mb-4">
              Your trusted partner for fast, secure, and reliable loans in
              Kenya. We're committed to helping you achieve your financial
              goals.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center space-x-3 text-sm hover:text-white transition-colors"
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                    >
                      <item.icon className="text-primary-400" size={16} />
                      <span>{item.text}</span>
                    </a>
                  ) : (
                    <div className="flex items-center space-x-3 text-sm">
                      <item.icon className="text-primary-400" size={16} />
                      <span>{item.text}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400">Licensed by</p>
              <p className="text-sm font-semibold text-white">CBK</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400">SSL Secure</p>
              <p className="text-sm font-semibold text-white">256-bit</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400">Member of</p>
              <p className="text-sm font-semibold text-white">KBA</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400">ISO Certified</p>
              <p className="text-sm font-semibold text-white">27001:2022</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-400">
              © {currentYear} Speedy Cash Solutions. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

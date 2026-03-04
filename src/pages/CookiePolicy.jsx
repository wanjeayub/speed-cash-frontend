import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiChevronRight,
  //   FiCookie,
  FiInfo,
  FiSettings,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CookiePolicy = () => {
  const lastUpdated = "March 1, 2026";
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    functional: true,
    analytics: false,
    marketing: false,
  });

  const savePreferences = () => {
    // In a real implementation, this would save to localStorage or send to backend
    alert("Cookie preferences saved!");
  };

  return (
    <>
      <Helmet>
        <title>Cookie Policy - Speed - Cash Solutions</title>
        <meta
          name="description"
          content="Learn about how Speed - Cash Solutions uses cookies and similar technologies to improve your experience."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full mb-4">
                <FiCookie className="text-white mr-2" size={20} />
                <span className="text-white text-sm font-medium">
                  Last Updated: {lastUpdated}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Cookie Policy
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                How we use cookies and similar technologies
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What Are Cookies?
                </h2>
                <p className="text-gray-700">
                  Cookies are small text files that are placed on your computer
                  or mobile device when you visit a website. They are widely
                  used to make websites work more efficiently and provide
                  information to the owners of the site [citation:3].
                </p>
              </section>

              {/* How We Use Cookies */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  How We Use Cookies
                </h2>
                <p className="text-gray-700 mb-4">
                  We use cookies for the following purposes:
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="font-semibold">Essential Cookies</h3>
                    <p className="text-sm text-gray-600">
                      Required for the website to function properly. These
                      cannot be disabled. They include session cookies that keep
                      you logged in and security cookies that protect your
                      account.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-semibold">Functional Cookies</h3>
                    <p className="text-sm text-gray-600">
                      Remember your preferences and settings to enhance your
                      experience, such as language preferences and saved form
                      data.
                    </p>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 py-2">
                    <h3 className="font-semibold">Analytics Cookies</h3>
                    <p className="text-sm text-gray-600">
                      Help us understand how visitors interact with our website
                      by collecting anonymous information. We use this data to
                      improve our services.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h3 className="font-semibold">Marketing Cookies</h3>
                    <p className="text-sm text-gray-600">
                      Used to track visitors across websites to display relevant
                      advertisements and measure campaign effectiveness.
                    </p>
                  </div>
                </div>
              </section>

              {/* Cookie Preferences */}
              <section className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FiSettings className="mr-2" />
                  Manage Cookie Preferences
                </h2>
                <p className="text-gray-700 mb-6">
                  You can choose which cookies to accept. Essential cookies are
                  always enabled as they are necessary for the website to
                  function.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div>
                      <p className="font-semibold">Essential Cookies</p>
                      <p className="text-sm text-gray-600">
                        Required for basic functionality
                      </p>
                    </div>
                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                      Always Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div>
                      <p className="font-semibold">Functional Cookies</p>
                      <p className="text-sm text-gray-600">
                        Remember your preferences
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={cookiePreferences.functional}
                        onChange={(e) =>
                          setCookiePreferences({
                            ...cookiePreferences,
                            functional: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div>
                      <p className="font-semibold">Analytics Cookies</p>
                      <p className="text-sm text-gray-600">
                        Help us improve our website
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={cookiePreferences.analytics}
                        onChange={(e) =>
                          setCookiePreferences({
                            ...cookiePreferences,
                            analytics: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div>
                      <p className="font-semibold">Marketing Cookies</p>
                      <p className="text-sm text-gray-600">
                        Personalize advertisements
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={cookiePreferences.marketing}
                        onChange={(e) =>
                          setCookiePreferences({
                            ...cookiePreferences,
                            marketing: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button onClick={savePreferences} className="btn-primary">
                    Save Preferences
                  </button>
                </div>
              </section>

              {/* Third-Party Cookies */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Third-Party Cookies
                </h2>
                <p className="text-gray-700">
                  Some cookies are placed by third-party services that appear on
                  our pages. These may include:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>Google Analytics for website traffic analysis</li>
                  <li>Payment processors for transaction security</li>
                  <li>Social media platforms for sharing features</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  We do not control these cookies. Please check the respective
                  third-party websites for their cookie policies.
                </p>
              </section>

              {/* How to Control Cookies */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  How to Control Cookies
                </h2>
                <p className="text-gray-700 mb-3">
                  You can control and/or delete cookies as you wish through your
                  browser settings. Here's how:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Chrome</h3>
                    <p className="text-sm">
                      Settings → Privacy and security → Cookies and other site
                      data
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Firefox</h3>
                    <p className="text-sm">
                      Options → Privacy & Security → Cookies and Site Data
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Safari</h3>
                    <p className="text-sm">
                      Preferences → Privacy → Cookies and website data
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Edge</h3>
                    <p className="text-sm">
                      Settings → Cookies and site permissions → Manage and
                      delete cookies
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Please note that disabling cookies may affect the
                  functionality of our website.
                </p>
              </section>

              {/* Updates */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Updates to This Policy
                </h2>
                <p className="text-gray-700">
                  We may update this Cookie Policy from time to time. Any
                  changes will be posted on this page with an updated revision
                  date.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Contact Us
                </h2>
                <p className="text-gray-700">
                  If you have questions about our use of cookies, please contact
                  us at{" "}
                  <a
                    href="mailto:privacy@speedcash.co.ke"
                    className="text-primary-600 hover:underline"
                  >
                    privacy@speedcash.co.ke
                  </a>
                </p>
              </section>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-700 inline-flex items-center"
            >
              <FiChevronRight className="mr-1 rotate-180" size={16} />
              Back to Home
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default CookiePolicy;

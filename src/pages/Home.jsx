import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import {
  FiClock,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
  FiArrowRight,
  FiStar,
  FiAward,
  FiThumbsUp,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      icon: FiClock,
      title: "Quick Approval",
      description: "Get loan approval within 24 hours of application",
    },
    {
      icon: FiShield,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties",
    },
    {
      icon: FiTrendingUp,
      title: "Flexible Terms",
      description: "Choose repayment terms that work for you",
    },
    {
      icon: FiUsers,
      title: "24/7 Support",
      description: "Our customer support team is always available to help",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Customers", icon: FiUsers },
    { value: "KES 50M+", label: "Loans Disbursed", icon: FiTrendingUp },
    { value: "98%", label: "Customer Satisfaction", icon: FiStar },
    { value: "15 min", label: "Average Application Time", icon: FiClock },
  ];

  const testimonials = [
    {
      name: "John Mwangi",
      role: "Small Business Owner",
      content:
        "Speedy Cash helped me grow my business when I needed it most. The process was quick and hassle-free.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Sarah Kimani",
      role: "Teacher",
      content:
        "I needed emergency funds for school fees. Speedy Cash came through within hours. Highly recommended!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      name: "David Omondi",
      role: "Freelancer",
      content:
        "The best loan service I've used. Transparent terms, fair interest rates, and excellent customer service.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your account in less than 2 minutes",
    },
    {
      number: "02",
      title: "Complete Profile",
      description: "Upload your documents and verify your identity",
    },
    {
      number: "03",
      title: "Apply for Loan",
      description: "Choose your loan amount and purpose",
    },
    {
      number: "04",
      title: "Get Funded",
      description: "Receive money in your account within 24 hours",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Speedy Cash Solutions - Fast & Reliable Loans in Kenya</title>
        <meta
          name="description"
          content="Get quick loans in Kenya with Speedy Cash Solutions. Fast approval, competitive rates, and excellent customer service. Apply online today!"
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
                  Fast, Easy & Secure Loans in Kenya
                </h1>
                <p className="text-xl mb-8 text-primary-100">
                  Get the funds you need when you need them most. Apply online
                  and get approved within hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/register"
                        className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                      >
                        Get Started
                        <FiArrowRight className="ml-2" />
                      </Link>
                      <Link
                        to="/login"
                        className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                      >
                        Sign In
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                    >
                      Go to Dashboard
                      <FiArrowRight className="ml-2" />
                    </Link>
                  )}
                </div>
                <div className="mt-8 flex items-center space-x-6">
                  <div className="flex items-center">
                    <FiCheckCircle className="text-green-300 mr-2" />
                    <span>No hidden fees</span>
                  </div>
                  <div className="flex items-center">
                    <FiCheckCircle className="text-green-300 mr-2" />
                    <span>Instant approval</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Happy customer"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="text-4xl text-primary-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Speedy Cash?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We make borrowing simple, transparent, and accessible to
                everyone
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="text-3xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get your loan in four simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-5xl font-bold text-primary-200 mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <FiArrowRight className="text-2xl text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Don't just take our word for it - hear from our happy customers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar
                        key={i}
                        className="text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="bg-primary-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of Kenyans who trust Speedy Cash for their
              financial needs
            </p>
            {!isAuthenticated ? (
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                Create Free Account
                <FiArrowRight className="ml-2" />
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                Go to Dashboard
                <FiArrowRight className="ml-2" />
              </Link>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;

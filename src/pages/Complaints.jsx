import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiChevronRight,
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiClock,
  FiCheckCircle,
  FiSend,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

const Complaints = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    loanNumber: "",
    subject: "",
    message: "",
    preferredContact: "email",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Complaint submitted successfully");
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Complaints - Speed - Cash Solutions</title>
        <meta
          name="description"
          content="Submit a complaint to Speed - Cash Solutions. We're committed to resolving your issues quickly and fairly."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full mb-4">
                <FiAlertCircle className="text-white mr-2" size={20} />
                <span className="text-white text-sm font-medium">
                  Customer Support
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                File a Complaint
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                We're here to help resolve any issues you may have
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Response Time Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <FiClock className="text-primary-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold">Response Time</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  We aim to respond to all complaints within{" "}
                  <span className="font-bold">24-48 hours</span>. Complex issues
                  may take longer to investigate.
                </p>
              </div>

              {/* Contact Options */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Other Ways to Reach Us
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiPhone className="text-primary-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-gray-600">+254 700 123 456</p>
                      <p className="text-xs text-gray-500">
                        Mon-Fri: 8am - 6pm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiMail className="text-primary-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">
                        complaints@speedcash.co.ke
                      </p>
                      <p className="text-xs text-gray-500">24/7 monitoring</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiMessageCircle className="text-primary-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-gray-600">Available in-app</p>
                      <p className="text-xs text-gray-500">24/7 support</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escalation Path */}
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FiAlertCircle className="text-yellow-600 mr-2" />
                  Not satisfied with our response?
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  If you're not happy with how we've handled your complaint, you
                  can escalate to:
                </p>
                <div className="bg-white p-3 rounded-lg text-sm">
                  <p className="font-medium">Central Bank of Kenya</p>
                  <p>compliance@centralbank.go.ke</p>
                </div>
                <div className="bg-white p-3 rounded-lg text-sm mt-2">
                  <p className="font-medium">
                    Office of the Data Protection Commissioner
                  </p>
                  <p>complaints@odpc.go.ke</p>
                </div>
              </div>
            </div>

            {/* Right Column - Complaint Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="text-green-600" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Complaint Received!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for bringing this to our attention. We've received
                    your complaint and will investigate it promptly. Our team
                    will contact you within 24-48 hours.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Reference number:{" "}
                    <span className="font-mono">
                      CMP-{Date.now().toString().slice(-8)}
                    </span>
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-primary"
                  >
                    Submit Another Complaint
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold mb-6">Complaint Form</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="input-field"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="input-field"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="input-field"
                          placeholder="0712345678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loan Number (if applicable)
                        </label>
                        <input
                          type="text"
                          value={formData.loanNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              loanNumber: e.target.value,
                            })
                          }
                          className="input-field"
                          placeholder="e.g., SCL240300001"
                        />
                      </div>
                    </div>

                    {/* Complaint Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="input-field"
                      >
                        <option value="">Select a subject</option>
                        <option value="loan-issue">
                          Loan Application Issue
                        </option>
                        <option value="repayment">Repayment Problem</option>
                        <option value="crb">CRB Listing Dispute</option>
                        <option value="account">Account Access Problem</option>
                        <option value="fraud">
                          Fraud / Unauthorized Transaction
                        </option>
                        <option value="data">Data Privacy Concern</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Complaint Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Detailed Description *
                      </label>
                      <textarea
                        required
                        rows="6"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="input-field"
                        placeholder="Please provide as much detail as possible about your complaint..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Include relevant dates, amounts, and any reference
                        numbers if available.
                      </p>
                    </div>

                    {/* Preferred Contact Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Contact Method *
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="email"
                            checked={formData.preferredContact === "email"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                preferredContact: e.target.value,
                              })
                            }
                            className="mr-2"
                          />
                          Email
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="phone"
                            checked={formData.preferredContact === "phone"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                preferredContact: e.target.value,
                              })
                            }
                            className="mr-2"
                          />
                          Phone
                        </label>
                      </div>
                    </div>

                    {/* Supporting Documents Note */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> You will have the opportunity to
                        upload supporting documents after submitting this form.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center space-x-2 px-8"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <FiSend />
                            <span>Submit Complaint</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Privacy Notice */}
                  <p className="text-xs text-gray-500 mt-6 border-t pt-4">
                    By submitting this form, you consent to us processing your
                    personal data for the purpose of investigating and
                    responding to your complaint. We will handle your
                    information in accordance with our Privacy Policy.
                  </p>
                </div>
              )}
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

export default Complaints;

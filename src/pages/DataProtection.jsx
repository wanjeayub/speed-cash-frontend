import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiChevronRight,
  FiShield,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiUserCheck,
  FiFileText,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DataProtection = () => {
  const lastUpdated = "March 1, 2026";

  return (
    <>
      <Helmet>
        <title>Data Protection Policy - Speed - Cash Solutions</title>
        <meta
          name="description"
          content="Speed - Cash Solutions' commitment to protecting your personal data in compliance with the Kenya Data Protection Act, 2019."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full mb-4">
                <FiShield className="text-white mr-2" size={20} />
                <span className="text-white text-sm font-medium">
                  Last Updated: {lastUpdated}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Data Protection Policy
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Our commitment to protecting your personal information
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Registration Badge */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border-l-4 border-green-500">
            <div className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" size={32} />
              <div>
                <h2 className="text-lg font-semibold">
                  Registered Data Controller
                </h2>
                <p className="text-gray-600">
                  Speed - Cash Solutions is registered with the Office of the
                  Data Protection Commissioner (ODPC) in compliance with the
                  Kenya Data Protection Act, 2019 [citation:4].
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Section 1: Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Introduction
                </h2>
                <p className="text-gray-700">
                  Speed - Cash Solutions is committed to protecting the privacy
                  and security of your personal data. This Data Protection
                  Policy outlines our approach to data protection in accordance
                  with the Kenya Data Protection Act, 2019 and the General Data
                  Protection Regulation (GDPR) principles where applicable
                  [citation:2][citation:8].
                </p>
              </section>

              {/* Section 2: Key Principles */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Data Protection Principles
                </h2>
                <p className="text-gray-700 mb-4">
                  We adhere to the following data protection principles
                  [citation:3]:
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-primary-700 text-sm">1</span>
                      </span>
                      Lawfulness, Fairness, and Transparency
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We process personal data lawfully, fairly, and in a
                      transparent manner.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-primary-700 text-sm">2</span>
                      </span>
                      Purpose Limitation
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We collect data for specified, explicit, and legitimate
                      purposes only.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-primary-700 text-sm">3</span>
                      </span>
                      Data Minimization
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We only collect data that is adequate, relevant, and
                      necessary for our services.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-primary-700 text-sm">4</span>
                      </span>
                      Accuracy
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We take reasonable steps to ensure data is accurate and
                      kept up to date.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-primary-700 text-sm">5</span>
                      </span>
                      Storage Limitation
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We keep data for no longer than necessary for the purposes
                      for which it is processed.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center">
                      <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-primary-700 text-sm">6</span>
                      </span>
                      Integrity and Confidentiality
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We process data securely, protecting against unauthorized
                      access, loss, or damage.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Legal Basis for Processing */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Legal Basis for Processing
                </h2>
                <p className="text-gray-700 mb-4">
                  We process personal data under the following legal bases
                  [citation:8]:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Consent</p>
                      <p className="text-sm text-gray-600">
                        Where you have given clear consent for us to process
                        your data for specific purposes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Contract</p>
                      <p className="text-sm text-gray-600">
                        Processing necessary for the performance of a contract
                        with you.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Legal Obligation</p>
                      <p className="text-sm text-gray-600">
                        Processing necessary for compliance with legal
                        obligations (e.g., CRB reporting, tax laws).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Legitimate Interests</p>
                      <p className="text-sm text-gray-600">
                        Processing necessary for our legitimate interests,
                        provided they do not override your rights.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Data Subject Rights */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Your Data Subject Rights
                </h2>
                <p className="text-gray-700 mb-4">
                  Under the Data Protection Act, you have the following rights
                  [citation:2]:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold">Right to be Informed</h3>
                    <p className="text-sm">
                      Clear information about how we use your data.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold">Right of Access</h3>
                    <p className="text-sm">
                      Request a copy of your personal data.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold">Right to Rectification</h3>
                    <p className="text-sm">
                      Correct inaccurate or incomplete data.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold">Right to Erasure</h3>
                    <p className="text-sm">
                      Request deletion of your data in certain circumstances.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold">
                      Right to Restrict Processing
                    </h3>
                    <p className="text-sm">Limit how we use your data.</p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold">Right to Data Portability</h3>
                    <p className="text-sm">
                      Receive your data in a portable format.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold">Right to Object</h3>
                    <p className="text-sm">
                      Object to processing based on legitimate interests.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold">
                      Rights related to Automated Decision Making
                    </h3>
                    <p className="text-sm">
                      Not be subject to decisions based solely on automated
                      processing.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 5: Security Measures */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Security Measures
                </h2>
                <p className="text-gray-700 mb-4">
                  We implement the following technical and organizational
                  measures [citation:4]:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiLock className="text-primary-600 mr-3 mt-1" />
                    <div>
                      <p className="font-semibold">Encryption</p>
                      <p className="text-sm">
                        All data is encrypted in transit (SSL/TLS) and at rest
                        using industry-standard encryption.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiLock className="text-primary-600 mr-3 mt-1" />
                    <div>
                      <p className="font-semibold">Access Controls</p>
                      <p className="text-sm">
                        Strict access controls ensure only authorized personnel
                        can access personal data.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiLock className="text-primary-600 mr-3 mt-1" />
                    <div>
                      <p className="font-semibold">Regular Audits</p>
                      <p className="text-sm">
                        We conduct regular security assessments and penetration
                        testing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiLock className="text-primary-600 mr-3 mt-1" />
                    <div>
                      <p className="font-semibold">Staff Training</p>
                      <p className="text-sm">
                        All employees undergo regular data protection and
                        security awareness training.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6: Data Breach Response */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Data Breach Response
                </h2>
                <p className="text-gray-700 mb-3">
                  In the event of a data breach [citation:3]:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>We will identify and contain the breach immediately.</li>
                  <li>We will assess the risk to affected individuals.</li>
                  <li>
                    We will notify the Office of the Data Protection
                    Commissioner within 72 hours where required.
                  </li>
                  <li>
                    We will notify affected individuals if there is a high risk
                    to their rights and freedoms.
                  </li>
                  <li>We will take steps to prevent future occurrences.</li>
                </ul>
              </section>

              {/* Section 7: Data Protection Officer */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Data Protection Officer
                </h2>
                <p className="text-gray-700">
                  We have appointed a Data Protection Officer (DPO) responsible
                  for overseeing our data protection strategy and ensuring
                  compliance with the Data Protection Act.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p>
                    <span className="font-semibold">DPO Contact:</span>{" "}
                    dpo@speedcash.co.ke
                  </p>
                </div>
              </section>

              {/* Section 8: Complaints */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Complaints
                </h2>
                <p className="text-gray-700">
                  If you believe we have not complied with data protection laws,
                  you have the right to lodge a complaint with the Office of the
                  Data Protection Commissioner [citation:2].
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="font-semibold">
                    Office of the Data Protection Commissioner (ODPC)
                  </p>
                  <p className="text-sm">Website: www.odpc.go.ke</p>
                  <p className="text-sm">Email: complaints@odpc.go.ke</p>
                </div>
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

export default DataProtection;

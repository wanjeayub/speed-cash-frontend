import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiChevronRight,
  FiShield,
  FiLock,
  FiEye,
  FiDatabase,
  FiShare2,
  FiUserCheck,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  const lastUpdated = "March 1, 2026";

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Speed - Cash Solutions</title>
        <meta
          name="description"
          content="Learn how Speed - Cash Solutions collects, uses, and protects your personal information in compliance with Kenyan data protection laws."
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
                Privacy Policy
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                How we collect, use, and protect your personal information
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Summary Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border-l-4 border-primary-500">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <p className="text-gray-700 text-sm">
              This Privacy Policy describes how Speed - Cash Solutions
              ("Company", "we", "us", or "our") collects, uses, and protects
              your personal data when you use our platforms and services. We are
              committed to protecting your privacy in accordance with the Kenya
              Data Protection Act, 2019 and are registered as a Data Controller
              with the Office of the Data Protection Commissioner (ODPC)
              [citation:2][citation:4].
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Section 1: Who We Are */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <FiUserCheck className="text-primary-700" size={16} />
                  </span>
                  1. Who We Are
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    Speed - Cash Solutions is a licensed Digital Credit Provider
                    operating in Kenya. We are the Data Controller responsible
                    for your personal data when you use our services
                    [citation:2][citation:8].
                  </p>
                  <p>
                    <span className="font-semibold">
                      Contact our Data Protection Officer:
                    </span>{" "}
                    dpo@speedcash.co.ke
                  </p>
                </div>
              </section>

              {/* Section 2: What Data We Collect */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <FiDatabase className="text-primary-700" size={16} />
                  </span>
                  2. What Data We Collect
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    We collect the following categories of personal data
                    [citation:2][citation:7][citation:8]:
                  </p>

                  <div className="space-y-4 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Identity Data</h3>
                      <p className="text-sm">
                        Full name, Kenyan ID number, date of birth, nationality,
                        gender, photos of your face and ID document.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Contact Data</h3>
                      <p className="text-sm">
                        Phone numbers (minimum two), email address, physical
                        address.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Financial Data</h3>
                      <p className="text-sm">
                        Income information, employment details, loan purpose,
                        bank account details, mobile money transaction history.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Device Data</h3>
                      <p className="text-sm">
                        IP address, device type, operating system, IMEI number,
                        device identifiers, location data [citation:7].
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Usage Data</h3>
                      <p className="text-sm">
                        How you interact with our platform, login times,
                        features used, loan applications and repayment history.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        Communications Data
                      </h3>
                      <p className="text-sm">
                        Records of your interactions with our customer support,
                        including emails, calls, and chat messages [citation:8].
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: How We Collect Data */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">3</span>
                  </span>
                  3. How We Collect Your Data
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    We collect your data from the following sources
                    [citation:2][citation:8]:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-semibold">
                        Information you give us:
                      </span>{" "}
                      When you register, complete your profile, apply for loans,
                      upload documents, or contact customer support.
                    </li>
                    <li>
                      <span className="font-semibold">
                        Information from your device:
                      </span>{" "}
                      When you install our app and grant necessary permissions,
                      we collect device and usage data [citation:7].
                    </li>
                    <li>
                      <span className="font-semibold">Third parties:</span> We
                      may receive information from credit reference bureaus,
                      identity verification services, and mobile network
                      operators [citation:2].
                    </li>
                    <li>
                      <span className="font-semibold">Public sources:</span> We
                      may verify your information against publicly available
                      databases and sanctions lists [citation:8].
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 4: How We Use Your Data */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">4</span>
                  </span>
                  4. How We Use Your Data
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    We use your personal data for the following purposes
                    [citation:2][citation:8]:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Purpose
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Lawful Basis
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm">
                            Account registration and verification
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Performance of contract, Legal obligation
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">
                            Credit assessment and scoring
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Legitimate interest, Consent
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">
                            Loan processing and disbursement
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Performance of contract
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">
                            Credit reporting to CRBs
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Legal obligation [citation:1]
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">
                            Fraud prevention and security
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Legitimate interest
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">
                            Customer support and communication
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Performance of contract
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">
                            Marketing and promotional offers
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Consent [citation:8]
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">
                            Compliance with legal obligations
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Legal obligation
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Section 5: Data Sharing */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <FiShare2 className="text-primary-700" size={16} />
                  </span>
                  5. Who We Share Your Data With
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    We may share your personal data with the following
                    categories of recipients [citation:2][citation:3]:
                  </p>

                  <div className="space-y-3 mt-4">
                    <div className="border-l-4 border-primary-200 pl-4 py-2">
                      <p className="font-semibold">
                        Credit Reference Bureaus (CRBs)
                      </p>
                      <p className="text-sm">
                        We are required by law to share both positive and
                        negative credit information with licensed CRBs
                        [citation:1].
                      </p>
                    </div>

                    <div className="border-l-4 border-primary-200 pl-4 py-2">
                      <p className="font-semibold">Payment Service Providers</p>
                      <p className="text-sm">
                        Mobile money operators and banks that process your
                        transactions.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary-200 pl-4 py-2">
                      <p className="font-semibold">Regulatory Authorities</p>
                      <p className="text-sm">
                        Central Bank of Kenya, Kenya Revenue Authority,
                        Financial Reporting Centre, and other government bodies
                        as required by law [citation:2].
                      </p>
                    </div>

                    <div className="border-l-4 border-primary-200 pl-4 py-2">
                      <p className="font-semibold">Service Providers</p>
                      <p className="text-sm">
                        Cloud storage providers, analytics services, customer
                        support platforms, and collection agencies [citation:2].
                      </p>
                    </div>

                    <div className="border-l-4 border-primary-200 pl-4 py-2">
                      <p className="font-semibold">Law Enforcement</p>
                      <p className="text-sm">
                        When required by law or to protect our legal rights
                        [citation:2].
                      </p>
                    </div>
                  </div>

                  <p className="text-sm bg-blue-50 p-3 rounded-lg mt-4">
                    <FiLock className="inline mr-2 text-blue-600" />
                    We require all third parties to respect your data privacy
                    and to treat it in accordance with the law. We only share
                    data necessary for the specific purpose.
                  </p>
                </div>
              </section>

              {/* Section 6: Data Security */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <FiLock className="text-primary-700" size={16} />
                  </span>
                  6. Data Security
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    We implement robust security measures to protect your data
                    [citation:4][citation:7]:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-semibold">Encryption:</span> All
                      data transmitted between your device and our servers is
                      encrypted using 256-bit SSL/TLS encryption.
                    </li>
                    <li>
                      <span className="font-semibold">Access Controls:</span>{" "}
                      Strict access controls ensure only authorized personnel
                      can access personal data.
                    </li>
                    <li>
                      <span className="font-semibold">Regular Audits:</span> We
                      conduct regular security assessments and penetration
                      testing.
                    </li>
                    <li>
                      <span className="font-semibold">
                        ISO 27001 Standards:
                      </span>{" "}
                      Our security practices align with ISO 27001 standards for
                      information security management [citation:4].
                    </li>
                    <li>
                      <span className="font-semibold">Data Minimization:</span>{" "}
                      We only collect data necessary for our services.
                    </li>
                  </ul>
                  <p className="mt-4">
                    While we implement strong security measures, no internet
                    transmission is 100% secure. You also play a role in
                    protecting your data by keeping your login credentials
                    confidential [citation:3].
                  </p>
                </div>
              </section>

              {/* Section 7: Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <FiEye className="text-primary-700" size={16} />
                  </span>
                  7. Your Data Protection Rights
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    Under the Kenya Data Protection Act, 2019, you have the
                    following rights [citation:2][citation:3]:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        Right to be Informed
                      </h3>
                      <p className="text-sm">
                        You have the right to clear information about how we use
                        your data.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Right to Access</h3>
                      <p className="text-sm">
                        Request a copy of your personal data we hold.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        Right to Correction
                      </h3>
                      <p className="text-sm">
                        Request correction of inaccurate or incomplete data.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Right to Deletion</h3>
                      <p className="text-sm">
                        Request deletion of your data when no longer needed.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Right to Object</h3>
                      <p className="text-sm">
                        Object to processing based on legitimate interests.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        Right to Data Portability
                      </h3>
                      <p className="text-sm">
                        Receive your data in a structured, machine-readable
                        format.
                      </p>
                    </div>
                  </div>

                  <p className="mt-6">
                    To exercise any of these rights, contact our Data Protection
                    Officer at{" "}
                    <span className="font-semibold">dpo@speedcash.co.ke</span>.
                    We will respond within 30 days [citation:2].
                  </p>
                </div>
              </section>

              {/* Section 8: Data Retention */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">8</span>
                  </span>
                  8. Data Retention
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    We retain your personal data for as long as necessary to
                    fulfill the purposes for which it was collected, including
                    to satisfy legal, regulatory, or accounting requirements
                    [citation:3].
                  </p>
                  <p>Specifically:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Account information: Retained while your account is active
                      and for 5 years after closure (for legal and audit
                      purposes).
                    </li>
                    <li>
                      Transaction data: Retained for 7 years as required by tax
                      and anti-money laundering regulations.
                    </li>
                    <li>
                      Loan records: Retained for 5 years after loan repayment
                      for credit reporting purposes.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 9: International Data Transfers */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">9</span>
                  </span>
                  9. International Data Transfers
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    We may transfer your data to servers located outside Kenya
                    (e.g., cloud servers in South Africa, United States, or
                    Europe) [citation:2]. When we do so, we ensure:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The country has adequate data protection laws, or</li>
                    <li>
                      We have contractual safeguards in place (standard data
                      protection clauses), or
                    </li>
                    <li>You have given explicit consent to the transfer</li>
                  </ul>
                </div>
              </section>

              {/* Section 10: Cookies */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">10</span>
                  </span>
                  10. Cookies and Tracking Technologies
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    We use cookies and similar technologies to enhance your
                    experience, analyze trends, and administer our platform
                    [citation:3]. You can control cookies through your browser
                    settings, but disabling them may affect functionality.
                  </p>
                  <p>
                    For more details, please read our{" "}
                    <Link
                      to="/cookie-policy"
                      className="text-primary-600 hover:underline"
                    >
                      Cookie Policy
                    </Link>
                    .
                  </p>
                </div>
              </section>

              {/* Section 11: Children's Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">11</span>
                  </span>
                  11. Children's Privacy
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    Our Services are not intended for individuals under 18 years
                    of age. We do not knowingly collect data from children
                    [citation:8]. If you become aware that a child has provided
                    us with personal data, please contact us immediately.
                  </p>
                </div>
              </section>

              {/* Section 12: Changes to This Policy */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">12</span>
                  </span>
                  12. Changes to This Privacy Policy
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    We may update this Privacy Policy from time to time. We will
                    notify you of any material changes through [citation:2]:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Notifications in our mobile app</li>
                    <li>SMS or email alerts</li>
                    <li>A notice on our website</li>
                  </ul>
                  <p>
                    The "Last Updated" date at the top of this page indicates
                    when this policy was last revised.
                  </p>
                </div>
              </section>

              {/* Section 13: Contact Us */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <FiMail className="text-primary-700" size={16} />
                  </span>
                  13. Contact Us
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    If you have questions about this Privacy Policy or wish to
                    exercise your rights:
                  </p>

                  <div className="bg-gray-50 p-6 rounded-lg mt-4">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FiMail className="text-primary-600 mr-3 mt-1" />
                        <div>
                          <p className="font-semibold">
                            Data Protection Officer:
                          </p>
                          <p>dpo@speedcash.co.ke</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiMail className="text-primary-600 mr-3 mt-1" />
                        <div>
                          <p className="font-semibold">Customer Support:</p>
                          <p>support@speedcash.co.ke</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiPhone className="text-primary-600 mr-3 mt-1" />
                        <div>
                          <p className="font-semibold">Phone:</p>
                          <p>+254 700 123 456</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4">
                    You also have the right to lodge a complaint with the Office
                    of the Data Protection Commissioner (ODPC) if you are
                    dissatisfied with our response [citation:2].
                  </p>
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

export default PrivacyPolicy;

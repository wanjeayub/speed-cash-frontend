import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiChevronRight,
  FiFileText,
  FiAlertCircle,
  FiShield,
  FiClock,
  FiPercent,
  FiUsers,
  FiLock,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TermsConditions = () => {
  // Last updated date
  const lastUpdated = "March 1, 2026";

  return (
    <>
      <Helmet>
        <title>Terms & Conditions - Speed - Cash Solutions</title>
        <meta
          name="description"
          content="Read the Terms and Conditions for Speed - Cash Solutions loan services. Understand your rights and obligations as a customer."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full mb-4">
                <FiFileText className="text-white mr-2" size={20} />
                <span className="text-white text-sm font-medium">
                  Last Updated: {lastUpdated}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Terms & Conditions
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Please read these terms carefully before using our loan services
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Quick Navigation Cards - Fixed anchor links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <a
              href="#agreement"
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer"
            >
              <FiFileText className="mx-auto text-primary-600 mb-2" size={24} />
              <span className="text-sm font-medium">Loan Agreement</span>
            </a>
            <a
              href="#interest"
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer"
            >
              <FiPercent className="mx-auto text-primary-600 mb-2" size={24} />
              <span className="text-sm font-medium">Interest Rates</span>
            </a>
            <a
              href="#repayment"
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer"
            >
              <FiClock className="mx-auto text-primary-600 mb-2" size={24} />
              <span className="text-sm font-medium">Repayment</span>
            </a>
            <a
              href="#default"
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer"
            >
              <FiAlertCircle
                className="mx-auto text-primary-600 mb-2"
                size={24}
              />
              <span className="text-sm font-medium">Default</span>
            </a>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <FiAlertCircle
                className="text-yellow-600 mr-3 flex-shrink-0 mt-1"
                size={24}
              />
              <div>
                <h3 className="font-bold text-yellow-800 mb-2">
                  Important Legal Notice
                </h3>
                <p className="text-yellow-700 text-sm">
                  This Agreement is a legally binding contract between you
                  ("Customer") and Speed - Cash Solutions ("Company", "we",
                  "us", or "our"). By accessing or using our loan services, you
                  agree to be bound by these Terms and Conditions. If you do not
                  agree with any part of these terms, please do not use our
                  services.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Section 1: Definitions */}
              <section id="agreement" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">1</span>
                  </span>
                  Definitions and Interpretation
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    In this Agreement, unless the context otherwise requires:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-semibold">"Account"</span> means
                      your loan account with Speed - Cash Solutions accessed
                      through our platform.
                    </li>
                    <li>
                      <span className="font-semibold">"Borrower"</span> or{" "}
                      <span className="font-semibold">"You"</span> means the
                      individual who has registered and uses our Services.
                    </li>
                    <li>
                      <span className="font-semibold">"Business Day"</span>{" "}
                      means a day other than Saturday, Sunday or public holiday
                      in Kenya.
                    </li>
                    <li>
                      <span className="font-semibold">
                        "Credit Reference Bureau"
                      </span>{" "}
                      means a bureau licensed under the Banking Act (Credit
                      Reference Bureau) Regulations to collect and share credit
                      information.
                    </li>
                    <li>
                      <span className="font-semibold">"Default"</span> means
                      failure to repay any amount due on the Repayment Date.
                    </li>
                    <li>
                      <span className="font-semibold">"Force Majeure"</span>{" "}
                      means events beyond our reasonable control including acts
                      of God, war, strikes, or government orders.
                    </li>
                    <li>
                      <span className="font-semibold">"Loan"</span> means the
                      principal amount advanced to you under this Agreement.
                    </li>
                    <li>
                      <span className="font-semibold">"Privacy Policy"</span>{" "}
                      means our policy that sets out how we collect and process
                      your personal data.
                    </li>
                    <li>
                      <span className="font-semibold">"Services"</span> means
                      all financial products and services offered through our
                      platform.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 2: Acceptance */}
              <section className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">2</span>
                  </span>
                  Acceptance of Terms
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    By registering for an account and using our Services, you
                    acknowledge that you have read, understood, and agree to be
                    bound by these Terms and Conditions.
                  </p>
                  <p>
                    You will be deemed to have accepted these Terms when you:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Complete the registration process and click "Accept"
                    </li>
                    <li>Submit a loan application through our platform</li>
                    <li>
                      Continue to use our Services after any updates to these
                      Terms
                    </li>
                  </ul>
                  <p className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mt-4">
                    <FiShield className="inline mr-2" />
                    If you do not agree with these Terms, please do not register
                    or use our Services.
                  </p>
                </div>
              </section>

              {/* Section 3: Eligibility */}
              <section className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">3</span>
                  </span>
                  Eligibility
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>To be eligible for our Services, you must:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Be a Kenyan citizen or resident with a valid Kenyan ID
                      number (7-8 digits)
                    </li>
                    <li>Be at least 18 years of age</li>
                    <li>
                      Have a valid mobile phone number registered in your name
                    </li>
                    <li>Have a valid email address</li>
                    <li>
                      Provide accurate and complete information during
                      registration
                    </li>
                    <li>
                      Not be currently declared bankrupt or have an active
                      bankruptcy proceeding
                    </li>
                  </ul>
                  <p>
                    We reserve the right to verify your eligibility and may
                    decline service at our sole discretion.
                  </p>
                </div>
              </section>

              {/* Section 4: Loan Application and Disbursement */}
              <section className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">4</span>
                  </span>
                  Loan Application and Disbursement
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    <span className="font-semibold">4.1 Application:</span> You
                    may apply for a loan through our platform by completing the
                    application form and providing all required information and
                    documentation.
                  </p>
                  <p>
                    <span className="font-semibold">
                      4.2 Credit Assessment:
                    </span>{" "}
                    We will assess your application using automated credit
                    scoring technology that considers your profile, transaction
                    history, and other data you provide.
                  </p>
                  <p>
                    <span className="font-semibold">4.3 Approval:</span> Loan
                    approval is at our sole discretion. We reserve the right to
                    decline any application without providing a reason.
                  </p>
                  <p>
                    <span className="font-semibold">4.4 Disbursement:</span>{" "}
                    Approved loans will be disbursed to your registered mobile
                    money account within 24 hours of approval.
                  </p>
                  <p>
                    <span className="font-semibold">4.5 Loan Amount:</span> The
                    minimum loan amount is KES 100 and the maximum is KES
                    1,000,000, subject to your credit limit and repayment
                    history.
                  </p>
                </div>
              </section>

              {/* Section 5: Interest and Fees */}
              <section id="interest" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">5</span>
                  </span>
                  Interest and Fees
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    <span className="font-semibold">5.1 Interest Rate:</span>{" "}
                    The standard interest rate is 10% per month (calculated on a
                    reducing balance basis). Interest is calculated daily on the
                    outstanding principal amount.
                  </p>
                  <p>
                    <span className="font-semibold">
                      5.2 Annual Percentage Rate (APR):
                    </span>{" "}
                    The APR ranges from 30% to 120% depending on the loan term
                    and amount. You will be shown the applicable APR before
                    accepting any loan offer.
                  </p>
                  <p>
                    <span className="font-semibold">5.3 Late Payment Fee:</span>{" "}
                    If you fail to make a payment by the due date, a late
                    payment fee of 5% of the overdue amount will be charged.
                  </p>
                  <p>
                    <span className="font-semibold">5.4 Default Interest:</span>{" "}
                    In case of default, interest will continue to accrue on the
                    outstanding amount at the default rate of 15% per month
                    until fully paid.
                  </p>
                  <p>
                    <span className="font-semibold">5.5 No Hidden Fees:</span>{" "}
                    We do not charge any processing fees, origination fees, or
                    early repayment penalties.
                  </p>
                </div>
              </section>

              {/* Section 6: Repayment */}
              <section id="repayment" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">6</span>
                  </span>
                  Repayment
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    <span className="font-semibold">6.1 Repayment Date:</span>{" "}
                    Loans are repayable within 30 days from the date of
                    disbursement, unless otherwise agreed.
                  </p>
                  <p>
                    <span className="font-semibold">
                      6.2 Repayment Methods:
                    </span>{" "}
                    You may repay your loan through:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Mobile money transfer to our paybill number</li>
                    <li>Bank transfer to our designated account</li>
                    <li>
                      Auto-debit from your registered mobile money account
                    </li>
                  </ul>
                  <p>
                    <span className="font-semibold">6.3 Early Repayment:</span>{" "}
                    You may repay your loan early without any penalty. Interest
                    will be calculated only up to the date of early repayment.
                  </p>
                  <p>
                    <span className="font-semibold">
                      6.4 Payment Allocation:
                    </span>{" "}
                    Payments will be applied first to any outstanding fees and
                    charges, then to accrued interest, and finally to the
                    principal amount.
                  </p>
                </div>
              </section>

              {/* Section 7: Default and Collections */}
              <section id="default" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">7</span>
                  </span>
                  Default and Collections
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    <span className="font-semibold">7.1 Event of Default:</span>{" "}
                    You will be in default if:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>You fail to make any payment when due</li>
                    <li>You provided false or misleading information</li>
                    <li>You become bankrupt or insolvent</li>
                    <li>You breach any term of this Agreement</li>
                  </ul>
                  <p>
                    <span className="font-semibold">
                      7.2 Consequences of Default:
                    </span>{" "}
                    Upon default, we may:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Declare the entire outstanding amount immediately due and
                      payable
                    </li>
                    <li>Charge default interest at 15% per month</li>
                    <li>Report your default to Credit Reference Bureaus</li>
                    <li>Engage collection agencies to recover the debt</li>
                    <li>Take legal action to recover the amount owed</li>
                  </ul>
                  <p>
                    <span className="font-semibold">
                      7.3 Credit Reference Bureau Reporting:
                    </span>{" "}
                    By accepting these Terms, you expressly consent to us
                    sharing your loan performance data (both positive and
                    negative) with licensed Credit Reference Bureaus in Kenya.
                    This information may be used by other lenders to assess your
                    creditworthiness.
                  </p>
                </div>
              </section>

              {/* Section 8: Credit Reporting */}
              <section className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">8</span>
                  </span>
                  Credit Reporting and CRB Listing
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>You acknowledge and agree that:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      We may conduct credit checks with Credit Reference Bureaus
                      before approving any loan
                    </li>
                    <li>
                      We will report your loan repayment history, including both
                      positive and negative information, to Credit Reference
                      Bureaus
                    </li>
                    <li>
                      If your account goes into default (over 30 days past due),
                      we will report your name, ID number, and default details
                      to Credit Reference Bureaus for listing
                    </li>
                    <li>
                      A negative listing may affect your ability to obtain
                      credit from other lenders in the future
                    </li>
                    <li>
                      You can access your credit report from any licensed Credit
                      Reference Bureau in Kenya
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 9: Privacy and Data Protection */}
              <section className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">9</span>
                  </span>
                  Privacy and Data Protection
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    We are committed to protecting your privacy in accordance
                    with the Kenya Data Protection Act, 2019. By using our
                    Services, you consent to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-semibold">Collection:</span> We
                      collect your personal information including name, ID
                      number, phone numbers, photos, device information, and
                      location data
                    </li>
                    <li>
                      <span className="font-semibold">Use:</span> We use your
                      data to verify your identity, assess creditworthiness,
                      process transactions, and improve our services
                    </li>
                    <li>
                      <span className="font-semibold">Sharing:</span> We may
                      share your data with credit reference bureaus, payment
                      processors, and regulatory authorities as required by law
                    </li>
                    <li>
                      <span className="font-semibold">Security:</span> We
                      implement industry-standard security measures including
                      SSL encryption to protect your data
                    </li>
                  </ul>
                  <p className="mt-4">
                    For more details, please read our{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-primary-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/data-protection"
                      className="text-primary-600 hover:underline"
                    >
                      Data Protection Policy
                    </Link>
                    .
                  </p>
                </div>
              </section>

              {/* Section 10: Your Rights */}
              <section className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">10</span>
                  </span>
                  Your Rights
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>As a customer, you have the following rights:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-semibold">
                        Right to be informed:
                      </span>{" "}
                      About how your data is collected and used
                    </li>
                    <li>
                      <span className="font-semibold">Right to access:</span>{" "}
                      Request a copy of your personal data we hold
                    </li>
                    <li>
                      <span className="font-semibold">
                        Right to correction:
                      </span>{" "}
                      Request correction of inaccurate information
                    </li>
                    <li>
                      <span className="font-semibold">Right to deletion:</span>{" "}
                      Request deletion of your account and data (subject to
                      legal retention requirements)
                    </li>
                    <li>
                      <span className="font-semibold">Right to object:</span>{" "}
                      Object to processing of your data for marketing purposes
                    </li>
                    <li>
                      <span className="font-semibold">
                        Right to data portability:
                      </span>{" "}
                      Receive your data in a structured format
                    </li>
                  </ul>
                  <p>
                    To exercise these rights, please contact our Data Protection
                    Officer at dpo@speedcash.co.ke.
                  </p>
                </div>
              </section>

              {/* Section 11: Limitation of Liability */}
              <section className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">11</span>
                  </span>
                  Limitation of Liability
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>To the maximum extent permitted by law:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      We shall not be liable for any indirect, incidental, or
                      consequential damages arising from your use of our
                      Services
                    </li>
                    <li>
                      Our total liability shall not exceed the total amount of
                      fees paid by you in the 12 months preceding the claim
                    </li>
                    <li>
                      We are not responsible for delays or failures caused by
                      Force Majeure events, network failures, or third-party
                      service providers
                    </li>
                    <li>
                      We do not guarantee that our Services will be
                      uninterrupted, timely, secure, or error-free
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 12: Termination */}
              <section className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">12</span>
                  </span>
                  Termination
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    <span className="font-semibold">12.1 By You:</span> You may
                    terminate your account at any time provided you have no
                    outstanding loans. Contact customer support to request
                    account deletion.
                  </p>
                  <p>
                    <span className="font-semibold">12.2 By Us:</span> We may
                    suspend or terminate your account immediately if you breach
                    these Terms, provide false information, or engage in
                    fraudulent activity.
                  </p>
                  <p>
                    <span className="font-semibold">
                      12.3 Effect of Termination:
                    </span>{" "}
                    Upon termination, all outstanding amounts become immediately
                    due and payable. We will retain your data as required by
                    law.
                  </p>
                </div>
              </section>

              {/* Section 13: Governing Law */}
              <section className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">13</span>
                  </span>
                  Governing Law and Dispute Resolution
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    <span className="font-semibold">13.1 Governing Law:</span>{" "}
                    This Agreement shall be governed by and construed in
                    accordance with the laws of the Republic of Kenya.
                  </p>
                  <p>
                    <span className="font-semibold">
                      13.2 Dispute Resolution:
                    </span>{" "}
                    Any dispute arising from this Agreement shall first be
                    resolved through negotiation. If negotiation fails, the
                    dispute may be referred to arbitration in accordance with
                    the Arbitration Act of Kenya.
                  </p>
                  <p>
                    <span className="font-semibold">13.3 Jurisdiction:</span>{" "}
                    The courts of Kenya shall have exclusive jurisdiction to
                    settle any disputes.
                  </p>
                </div>
              </section>

              {/* Section 14: Contact Information */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-700 font-bold">14</span>
                  </span>
                  Contact Information
                </h2>
                <div className="pl-11 space-y-4 text-gray-700">
                  <p>
                    If you have any questions about these Terms, please contact
                    us:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Email:</p>
                        <p className="text-primary-600">
                          support@speedcash.co.ke
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Phone:</p>
                        <p className="text-primary-600">+254 700 123 456</p>
                      </div>
                      <div>
                        <p className="font-semibold">
                          Data Protection Officer:
                        </p>
                        <p className="text-primary-600">dpo@speedcash.co.ke</p>
                      </div>
                      <div>
                        <p className="font-semibold">Address:</p>
                        <p>Nairobi, Kenya</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Note */}
            <div className="bg-gray-50 p-6 border-t text-center">
              <p className="text-sm text-gray-600">
                By using Speed - Cash Solutions, you acknowledge that you have
                read, understood, and agree to be bound by these Terms and
                Conditions.
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Speed - Cash Solutions is a licensed Digital Credit Provider
                regulated by the Central Bank of Kenya.
              </p>
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

export default TermsConditions;

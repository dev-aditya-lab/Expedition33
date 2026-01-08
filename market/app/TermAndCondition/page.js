const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-200 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto bg-[#0f172a] rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8">
          Last Updated: January 2026
        </p>

        {/* 1 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            1. Acceptance of Terms
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            By accessing or using GrowthAI, you agree to be bound by these
            Terms & Conditions. If you do not agree, please do not use
            the service.
          </p>
        </section>

        {/* 2 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            2. Description of Service
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            GrowthAI is an AI-powered growth marketing agent that autonomously
            plans and executes lead generation, email marketing, social media
            posting, and CRM updates based on user-defined business goals.
          </p>
        </section>

        {/* 3 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            3. User Responsibilities
          </h2>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-300">
            <li>Provide accurate and lawful business information</li>
            <li>Use the platform only for legitimate marketing purposes</li>
            <li>Avoid misuse, spamming, or unethical activities</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </section>

        {/* 4 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            4. AI Limitations & Disclaimer
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            GrowthAI uses artificial intelligence to generate marketing actions
            and recommendations. Results may vary depending on market conditions,
            audience behavior, and external factors. GrowthAI does not guarantee
            specific business outcomes.
          </p>
        </section>

        {/* 5 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            5. Data & Privacy
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            The collection and use of data are governed by our Privacy Policy.
            By using GrowthAI, you consent to data processing as described
            in the Privacy Policy.
          </p>
        </section>

        {/* 6 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            6. Third-Party Integrations
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            GrowthAI may integrate with third-party platforms such as CRM,
            email, or social media services. We are not responsible for the
            availability or behavior of these third-party services.
          </p>
        </section>

        {/* 7 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            7. Account Suspension or Termination
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            We reserve the right to suspend or terminate access to GrowthAI
            if a user violates these Terms or engages in harmful or illegal
            activities.
          </p>
        </section>

        {/* 8 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            8. Limitation of Liability
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            GrowthAI shall not be liable for any indirect, incidental, or
            consequential damages, including business losses resulting from
            the use of the platform.
          </p>
        </section>

        {/* 9 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            9. Changes to Terms
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            These Terms may be updated from time to time. Continued use of
            GrowthAI after changes implies acceptance of the revised Terms.
          </p>
        </section>

        {/* Back Button */}
        <div className="mt-8 sm:mt-10">
          <a
            href="/"
            className="inline-block w-full sm:w-auto text-center px-5 sm:px-6 py-3 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition text-white font-medium text-sm sm:text-base"
          >
            Back to Dashboard
          </a>
        </div>

      </div>
    </div>
  );
};

export default TermsAndConditions;

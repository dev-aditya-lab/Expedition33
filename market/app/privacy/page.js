const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-200 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto bg-[#0f172a] rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8">
          Last Updated: January 2026
        </p>

        {/* Section 1 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            1. Information We Collect
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-2 sm:mb-3">
            GrowthAI collects only the information required to provide
            autonomous growth marketing services. This includes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-300">
            <li>User name and email address</li>
            <li>Business and campaign details</li>
            <li>Lead and CRM-related data</li>
            <li>Platform usage analytics</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            2. How We Use Your Data
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-2 sm:mb-3">
            Our AI agent processes data strictly to achieve the business
            goals provided by the user, including:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-300">
            <li>Lead generation and qualification</li>
            <li>Email marketing and follow-ups</li>
            <li>Social media content scheduling</li>
            <li>CRM updates and reporting</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            3. Data Security
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            We use industry-standard security practices such as encrypted
            storage and secure API communication to protect user data.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            4. Data Sharing
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            GrowthAI does not sell or share personal data with third parties.
            Data is shared only with user-authorized platforms such as CRM
            and email services.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            5. Data Deletion
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            Users can request data deletion at any time. All associated
            data will be permanently removed from our systems.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            6. Contact Us
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            For privacy-related concerns, contact us at:
            <br />
            <span className="text-indigo-400 font-medium break-all">
              choubeyom873@gmail.com
            </span>
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

export default PrivacyPolicy;

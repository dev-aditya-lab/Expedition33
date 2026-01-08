"use client";
import { useState } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Fake API delay (hackathon demo)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-200 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto bg-[#0f172a] rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">
          Have questions or need support? We're here to help.
        </p>

        {/* SUCCESS MESSAGE */}
        {submitted ? (
          <div className="bg-green-600/20 border border-green-500 text-green-400 p-4 sm:p-6 rounded-lg sm:rounded-xl text-center">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              ✅ Message Sent Successfully
            </h2>
            <p className="text-sm sm:text-base">
              Thank you for reaching out. Our team will get back to you within
              24–48 hours.
            </p>
          </div>
        ) : (
          /* FORM */
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm mb-1">Name</label>
              <input
                required
                type="text"
                placeholder="Your name"
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg bg-[#020617] border border-gray-700 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm mb-1">Email</label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg bg-[#020617] border border-gray-700 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm mb-1">Message</label>
              <textarea
                required
                rows="4"
                placeholder="How can we help you?"
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-lg bg-[#020617] border border-gray-700 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition font-medium text-sm sm:text-base disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}

        {/* SUPPORT EMAIL */}
        {!submitted && (
          <div className="mt-6 sm:mt-8 text-center text-sm sm:text-base text-gray-400">
            Or email us directly at <br />
            <span className="text-indigo-400 font-medium break-all">
              support@growthai.com
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default Contact;

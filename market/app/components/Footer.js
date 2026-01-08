import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[rgba(10,11,20,0.85)] backdrop-blur">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-center gap-3 sm:gap-4 md:flex-row md:justify-between">

        {/* Brand */}
        <div className="text-xs sm:text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} <span className="font-medium text-gray-300">GrowthAI</span>.
          <span className="hidden sm:inline"> All rights reserved.</span>
        </div>

        {/* Links */}
        <nav className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <a href="/privacy" className="text-gray-400 hover:text-violet-400 active:text-violet-500 transition py-1 px-1">
            Privacy
          </a>
          <a href="/TermAndCondition" className="text-gray-400 hover:text-violet-400 active:text-violet-500 transition py-1 px-1">
            Terms
          </a>
          <a href="/contact" className="text-gray-400 hover:text-violet-400 active:text-violet-500 transition py-1 px-1">
            Contact
          </a>
        </nav>

      </div>
    </footer>
  );
}

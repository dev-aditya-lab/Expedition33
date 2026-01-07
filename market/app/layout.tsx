import "./globals.css";

export const metadata = {
  title: "AI Growth Marketing Agent",
  description: "AI-powered marketing automation app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">

        {/* HEADER */}
        <header className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

            {/* Left: Product Name */}
            <div>
              <h1 className="text-xl font-semibold">
                AI Growth Agent
              </h1>
              <p className="text-sm text-gray-500">
                Automates SEO, social media, email & WhatsApp marketing
              </p>
            </div>

            {/* Right: Action */}
            <button className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100">
              Start Agent
            </button>

          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-gray-500 text-center">
            © 2026 AI Growth Agent · Hackathon Project
          </div>
        </footer>

      </body>
    </html>
  );
}

"use client";

import { useState } from "react";

export default function HomePage() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const runAgent = async () => {
    if (!goal) {
      alert("Please enter a business goal");
      return;
    }

    setLoading(true);
    setData(null);

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal }),
    });

    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">

        <h1 className="text-2xl font-bold mb-2">
          AI Growth Marketing Agent
        </h1>
        <p className="text-gray-600 mb-6">
          Enter your business goal. The AI agent will plan and execute SEO,
          social media, email, and WhatsApp marketing automatically.
        </p>

        {/* Goal Input */}
        <input
          type="text"
          placeholder="e.g. Increase website traffic and leads"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
        />

        {/* Button */}
        <button
          onClick={runAgent}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:opacity-90"
        >
          {loading ? "AI Agent is working..." : "Run AI Agent"}
        </button>

        {/* Output */}
        {data && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">🧠 Agent Plan</h2>
            <ul className="list-disc ml-5 text-sm mb-4">
              {data.plan.map((item: any, index: number) => (
                <li key={index}>{item.task}</li>
              ))}
            </ul>

            <h2 className="font-semibold mb-2">⚙️ Execution Result</h2>
            <ul className="list-disc ml-5 text-sm text-green-700">
              {data.result.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

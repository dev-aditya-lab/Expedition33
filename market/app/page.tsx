"use client";

import { useState } from "react";

export default function HomePage() {
  const [businessName, setBusinessName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [goal, setGoal] = useState("");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const runAgent = async () => {
    if (!businessName || !productDesc || !targetAudience || !goal) {
      alert("Please fill all details");
      return;
    }

    setLoading(true);
    setData(null);

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName,
        productDesc,
        targetAudience,
        goal,
      }),
    });

    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">
          AI Growth Marketing Agent
        </h1>
        <p className="text-gray-600 mb-8">
          An AI agent that understands your business and runs SEO, social media,
          email & WhatsApp marketing automatically.
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT: Input Form */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-4">Business Details</h2>

            <input
              className="w-full border rounded-md px-4 py-2 mb-3"
              placeholder="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />

            <textarea
              className="w-full border rounded-md px-4 py-2 mb-3"
              rows={3}
              placeholder="Product / Service Description"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
            />

            <input
              className="w-full border rounded-md px-4 py-2 mb-3"
              placeholder="Target Audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />

            <input
              className="w-full border rounded-md px-4 py-2 mb-4"
              placeholder="Goal (what do you want to achieve?)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />

            <button
              onClick={runAgent}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md"
            >
              {loading ? "AI Agent is working..." : "Run AI Agent"}
            </button>
          </div>

          {/* RIGHT: Business Summary */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-4">
              Business Summary (AI Context)
            </h2>

            <p><b>🏢 Business:</b> {businessName || "-"}</p>
            <p className="mt-2"><b>📦 Product:</b> {productDesc || "-"}</p>
            <p className="mt-2"><b>🎯 Audience:</b> {targetAudience || "-"}</p>
            <p className="mt-2"><b>🚀 Goal:</b> {goal || "-"}</p>

            <p className="text-sm text-gray-500 mt-4">
              This information is used by the AI agent to plan and execute
              marketing tasks autonomously.
            </p>
          </div>
        </div>

        {/* AI Output */}
        {data && (
          <div className="bg-white p-6 rounded-xl shadow mt-6">
            <h2 className="font-semibold text-lg mb-3">🧠 AI Agent Plan</h2>
            <ul className="list-disc ml-5 mb-4">
              {data.plan.map((p: any, i: number) => (
                <li key={i}>{p.task}</li>
              ))}
            </ul>

            <h2 className="font-semibold text-lg mb-2">⚙️ Execution Result</h2>
            <ul className="list-disc ml-5 text-green-700">
              {data.result.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

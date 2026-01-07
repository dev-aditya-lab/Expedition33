"use client";

import { useState } from "react";

interface PlanItem {
  task: string;
}

interface AgentData {
  plan: PlanItem[];
  result: string[];
}

export default function HomePage() {
  const [businessName, setBusinessName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [goal, setGoal] = useState("");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AgentData | null>(null);

  const runAgent = async () => {
    if (!businessName || !productDesc || !targetAudience || !goal) {
      alert("Please fill all fields");
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
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-1">AI Growth Marketing Agent</h1>
        <p className="text-gray-600 mb-6">
          Provide your business details. The AI agent will handle SEO, social
          media, email & WhatsApp marketing.
        </p>

        {/* Business Name */}
        <input
          type="text"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full border rounded-md px-4 py-2 mb-3"
        />

        {/* Product Description */}
        <textarea
          placeholder="Product / Service Description"
          value={productDesc}
          onChange={(e) => setProductDesc(e.target.value)}
          className="w-full border rounded-md px-4 py-2 mb-3"
          rows={3}
        />

        {/* Target Audience */}
        <input
          type="text"
          placeholder="Target Audience (e.g. small business owners in India)"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          className="w-full border rounded-md px-4 py-2 mb-3"
        />

        {/* Goal */}
        <input
          type="text"
          placeholder="Goal (e.g. increase leads, traffic, sales)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full border rounded-md px-4 py-2 mb-4"
        />

        {/* Button */}
        <button
          onClick={runAgent}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:opacity-90"
        >
          {loading ? "AI Agent is working..." : "Run AI Agent"}
        </button>

        {/* Agent Output */}
        {data && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">🧠 Agent Plan</h2>
            <ul className="list-disc ml-5 text-sm mb-4">
              {data.plan.map((item: PlanItem, index: number) => (
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

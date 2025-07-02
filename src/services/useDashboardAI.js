// src/services/queryDashboardAI.js or .ts
const BASE_URL = "https://sonar-lab-server-8881cb834ac4.herokuapp.com";

export async function queryDashboardAI({ prompt, data }) {
  console.log("📦 Data received:", data);
  console.log("🧠 Prompt received:", prompt);

  const messages = [
    {
      role: "system",
      content: "You are an AI assistant helping interpret website analytics data.",
    },
    {
      role: "user",
      content: `Here's the website data: ${JSON.stringify(data)}.\n\nNow answer this: ${prompt}`,
    },
  ];

  try {
    const response = await fetch(`${BASE_URL}/api/openai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const result = await response.json();
    console.log("✅ OpenAI response:", result);
    return result.response;
  } catch (err) {
    console.error("❌ AI query error:", err);
    return "Error: Could not fetch response.";
  }
}

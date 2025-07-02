// src/components/AskDataAssistant.jsx
import { useState } from "react";
import { queryDashboardAI } from "../services/useDashboardAI";

interface AskDataAssistantProps {
  dashboardData: any; // Replace 'any' with a more specific type if available
}

function AskDataAssistant({ dashboardData }: AskDataAssistantProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    const prompt = `Answer the user's question based on the dashboard data below.\n\nData:\n${JSON.stringify(
      dashboardData
    )}\n\nQuestion:\n${question}`;
    const result = await queryDashboardAI({ prompt, data: null }); // data embedded in prompt
    setAnswer(result);
    setLoading(false);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <textarea
        className="w-full border p-2 rounded mb-2"
        rows={3}
        placeholder="Ask something like 'Which site had the highest traffic last week?'"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        onClick={handleAsk}
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Ask"}
      </button>
      {answer && <div className="mt-4 text-gray-800 whitespace-pre-line">{answer}</div>}
    </div>
  );
}

export default AskDataAssistant;

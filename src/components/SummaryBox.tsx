// src/components/SummaryBox.jsx
import { useState } from "react";
import { queryDashboardAI } from "../services/useDashboardAI";

type SummaryBoxProps = {
  dashboardData: any; // Replace 'any' with a more specific type if available
};

function SummaryBox({ dashboardData }: SummaryBoxProps) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(dashboardData);
  const generateSummary = async () => {
    setLoading(true);
    const prompt = "Generate a concise executive summary of the following dashboard data.";
    const result = await queryDashboardAI({ prompt, data: dashboardData });
    console.log(result);
    setSummary(result);
    setLoading(false);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">Dashboard Summary</h2>
      <button
        onClick={generateSummary}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Summary"}
      </button>
      {summary && <p className="mt-4 text-gray-700 whitespace-pre-line">{summary}</p>}
    </div>
  );
}

export default SummaryBox;

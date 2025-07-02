import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import PageViewsLineChart from "../charts/PageViewsLineChart";
import type { DataPoint } from "../types/DataPoint";
import TopPagesBarChart from "../charts/TopPagesBarChart";
import UserFlowHeatMap from "../charts/UserFlowHeatMap";
import SiteFilter from "./SiteFilter";
import { useSearchParams } from "react-router-dom";
import { exportCSV, exportPDF } from "../utils/exportUtils";
import { trimMetrics } from "../utils/trimMatrics";
import { useAuth } from "../authentication/useAuth";

import SummaryBox from "./SummaryBox";
import AskDataAssistant from "./AskDataAssistant";

function Dashboard() {
  const { role, user, logout } = useAuth();
  const canDownload = role === "admin";
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSiteIds = searchParams.get("sites")
    ? searchParams.get("sites")!.split(",")
    : [];
  const [siteIds, setSiteIds] = useState<string[]>(initialSiteIds);
  const data = useWebSocket({ siteIds }) as DataPoint[];
  const allData = useWebSocket({ disableFilter: true }) as DataPoint[];
  const aiData = trimMetrics(allData);

  const [showSummary, setShowSummary] = useState(false);

  // Get unique site list
  const uniqueSites = Array.from(new Set(data.map((item) => item.siteId))).map(
    (siteId) => {
      const site = data.find((item) => item.siteId === siteId);
      return {
        id: siteId,
        name: site?.siteName || siteId,
      };
    }
  );

  useEffect(() => {
    const ids = searchParams.get("sites")
      ? searchParams.get("sites")!.split(",")
      : [];
    setSiteIds(ids);
  }, [searchParams]);

  const [selectedSite, setSelectedSite] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [lineChartData, setLineChartData] = useState<
    { date: string; pv: number }[]
  >([]);
  const [barChartData, setBarChartData] = useState<
    { path: string; views: number }[]
  >([]);
  const [heatMapData, setHeatMapData] = useState<
    { from: string; to: string; count: number }[]
  >([]);

  useEffect(() => {
    if (uniqueSites.length > 0 && !selectedSite) {
      setSelectedSite(uniqueSites[0]);
    }
  }, [uniqueSites, selectedSite]);

  useEffect(() => {
    if (selectedSite) {
      const siteData = data.filter((item) => item.siteId === selectedSite.id);

      const lineData = siteData.map((item) => ({
        date: new Date(item.timestamp).toLocaleTimeString(),
        pv: item.pageViews,
      }));
      setLineChartData(lineData);

      const aggregatedPages: { [path: string]: number } = {};
      siteData.forEach((item) => {
        item.topPages.forEach((page) => {
          aggregatedPages[page.path] =
            (aggregatedPages[page.path] || 0) + page.views;
        });
      });
      const barData = Object.entries(aggregatedPages).map(([path, views]) => ({
        path,
        views,
      }));
      setBarChartData(barData);

      const aggregatedFlows: Record<string, number> = {};
      siteData.forEach((item) => {
        item.userFlow.forEach((flow) => {
          const key = `${flow.from} → ${flow.to}`;
          aggregatedFlows[key] = (aggregatedFlows[key] || 0) + flow.count;
        });
      });
      const heatMap = Object.entries(aggregatedFlows).map(([route, count]) => {
        const [from, to] = route.split(" → ");
        return { from, to, count };
      });
      setHeatMapData(heatMap);
    }
  }, [selectedSite, data]);

  const handleSiteSelect = (siteId: string) => {
    const site = uniqueSites.find((s) => s.id === siteId);
    if (site) setSelectedSite(site);
  };

  const handleFilterChange = (selectedIds: string[]) => {
    setSiteIds(selectedIds);
    if (selectedIds.length > 0) {
      setSearchParams({ sites: selectedIds.join(",") });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-end">
        {user ? (
          <button
            onClick={logout}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Logout ({user.email})
          </button>
        ) : (
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
            Login
          </a>
        )}
      </div>

      <SiteFilter
        sites={uniqueSites}
        selectedSiteIds={siteIds}
        onChange={handleFilterChange}
      />

      <div className="flex gap-2 flex-wrap">
        {uniqueSites.map((site) => (
          <button
            key={site.id}
            onClick={() => handleSiteSelect(site.id)}
            className={`px-4 py-2 rounded ${
              selectedSite?.id === site.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {site.name}
          </button>
        ))}
      </div>

      <PageViewsLineChart
        data={lineChartData}
        selectedName={selectedSite?.name || ""}
      />
      <TopPagesBarChart
        data={barChartData}
        selectedName={selectedSite?.name || ""}
      />
      <UserFlowHeatMap
        data={heatMapData}
        selectedName={selectedSite?.name || ""}
      />
      <div className="flex justify-start">
        <button
          onClick={() => setShowSummary(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Generate Summary
        </button>
      </div>

      {showSummary && <SummaryBox dashboardData={aiData} />}
      <AskDataAssistant dashboardData={aiData} />
      <div className="flex gap-4">
        {canDownload && (
          <>
            <button
              onClick={() => exportCSV(lineChartData, "page_views")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Export Page Views CSV
            </button>
            <button
              onClick={() =>
                exportPDF(lineChartData, "page_views", "Page Views")
              }
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Export Page Views PDF
            </button>
            <button
              onClick={() => exportCSV(barChartData, "top_pages")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Export Top Pages CSV
            </button>
            <button
              onClick={() => exportPDF(barChartData, "top_pages", "Top Pages")}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Export Top Pages PDF
            </button>
            <button
              onClick={() => exportCSV(heatMapData, "user_flow")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Export User Flow CSV
            </button>
            <button
              onClick={() => exportPDF(heatMapData, "user_flow", "User Flow")}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Export User Flow PDF
            </button>
            <button
              onClick={() =>
                exportCSV(trimMetrics(allData), "all_data_summary")
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Export Summary CSV
            </button>
            <button
              onClick={() =>
                exportPDF(trimMetrics(allData), "all_data_summary", "Summary")
              }
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Export Summary PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

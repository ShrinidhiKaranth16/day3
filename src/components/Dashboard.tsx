import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import PageViewsLineChart from "../charts/PageViewsLineChart";
import type { DataPoint } from "../types/DataPoint";
import TopPagesBarChart from "../charts/TopPagesBarChart";
import UserFlowHeatMap from "../charts/UserFlowHeatMap";
import SiteFilter from "./SiteFilter";
import { useSearchParams } from "react-router-dom";

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSiteIds = searchParams.get("sites")
    ? searchParams.get("sites")!.split(",")
    : [];
  const [siteIds, setSiteIds] = useState<string[]>(initialSiteIds);
  const data = useWebSocket(siteIds) as DataPoint[];

  console.log(data);
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
  // Selected site (full object)
  const [selectedSite, setSelectedSite] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Chart data based on selected site
  const [lineChartData, setLineChartData] = useState<
    { date: string; pv: number }[]
  >([]);
  const [barChartData, setBarChartData] = useState<
    { path: string; views: number }[]
  >([]);

  const [heatMapData, setHeatMapData] = useState<
    { from: string; to: string; count: number }[]
  >([]);
  // Set default selected site on initial data load
  useEffect(() => {
    if (uniqueSites.length > 0 && !selectedSite) {
      setSelectedSite(uniqueSites[0]);
    }
  }, [uniqueSites, selectedSite]);

  // Update chart data when selected site or raw data changes
  useEffect(() => {
    if (selectedSite) {
      const siteData = data.filter((item) => item.siteId === selectedSite.id);

      // Line Chart Data
      const lineData = siteData.map((item) => ({
        date: new Date(item.timestamp).toLocaleTimeString(),
        pv: item.pageViews,
      }));
      setLineChartData(lineData);

      // Bar Chart Data
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
      <SiteFilter
        sites={uniqueSites}
        selectedSiteIds={siteIds}
        onChange={handleFilterChange}
      />

      {/* Site Selector */}
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

      {/* Page Views Line Chart */}
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
    </div>
  );
}

export default Dashboard;

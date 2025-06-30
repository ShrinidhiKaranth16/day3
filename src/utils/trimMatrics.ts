import type { DataPoint } from "../types/DataPoint";
export const trimMetrics = (data: DataPoint[]) =>
  data.map(
    ({
      timestamp,
      siteId,
      siteName,
      pageViews,
      uniqueVisitors,
      bounceRate,
      avgSessionDuration,
    }) => ({
      timestamp,
      siteId,
      siteName,
      pageViews,
      uniqueVisitors,
      bounceRate,
      avgSessionDuration,
    })
  );

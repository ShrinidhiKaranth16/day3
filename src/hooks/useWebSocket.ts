import { useEffect, useRef, useState } from "react";
import type { DataPoint } from "../types/DataPoint";

interface UseWebSocketOptions {
  siteIds?: string[];
  disableFilter?: boolean;
}

export const useWebSocket = ({
  siteIds,
  disableFilter = false,
}: UseWebSocketOptions): DataPoint[] => {
  const [data, setData] = useState<DataPoint[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      "wss://sonar-lab-server-8881cb834ac4.herokuapp.com/"
    );
    //const ws = new WebSocket("ws://localhost:8080");

    wsRef.current = ws;

    ws.onmessage = (event) => {
      const point: DataPoint = JSON.parse(event.data);
      setData((prev) => [...prev.slice(-999), point]);
    };

    ws.onerror = (e) => {
      console.error("WebSocket error", e);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Send filter message unless filtering is disabled
  useEffect(() => {
    if (disableFilter || !siteIds) return;

    const sendFilter = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "filter", siteIds }));
        return true;
      }
      return false;
    };

    // Retry if WebSocket not ready
    if (!sendFilter()) {
      const interval = setInterval(() => {
        if (sendFilter()) clearInterval(interval);
      }, 100);
    }
  }, [siteIds, disableFilter]);

  return data;
};

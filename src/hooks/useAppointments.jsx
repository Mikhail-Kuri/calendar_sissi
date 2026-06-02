import { useState, useCallback, useRef } from "react";
import { isPastMonth, toUTCStart, toUTCEnd } from "../utils/calendarUtils";
import { fetchAppointments } from "../services/fetcher/fetchAppointments";

export function useAppointments(duration) {
  const [eventsCache, setEventsCache] = useState({});
  const [loadingMonths, setLoadingMonths] = useState({});

  const cacheRef = useRef({});
  const loadingRef = useRef({});
  const loadMonth = useCallback(
    async (year, month, { force = false } = {}) => {
      const key = `${year}-${month}`;

      if (isPastMonth(year, month)) {
        console.log("⛔ mois passé ignoré:", key);
        return;
      }

      if (!force && (cacheRef.current[key] || loadingRef.current[key])) {
        return;
      }

      loadingRef.current[key] = true;

      setLoadingMonths((prev) => ({
        ...prev,
        [key]: true,
      }));

      try {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);

        const events = await fetchAppointments(
          toUTCStart(start),
          toUTCEnd(end),
          duration,
        );

        cacheRef.current[key] = events;

        setEventsCache((prev) => ({
          ...prev,
          [key]: events,
        }));

        return events;
      } finally {
        loadingRef.current[key] = false;

        setLoadingMonths((prev) => ({
          ...prev,
          [key]: false,
        }));
      }
    },
    [duration],
  );

  return {
    eventsCache,
    loadingMonths,
    loadMonth,
  };
}

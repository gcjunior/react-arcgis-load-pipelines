import { useEffect, useState } from "react";
import { url } from "./constants";

export const useArcGISMap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 5 : prev));
    }, 200);

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
        setProgress(100);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        clearInterval(interval);
      }
    };

    fetchData();
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, progress };
};

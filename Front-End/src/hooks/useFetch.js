import { useState, useEffect } from "react";
import api from "../services/api";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't fetch if url is null, undefined, or empty string
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(url, options);
        setData(response.data);
      } catch (err) {
        setError(err);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(options)]); // Use JSON.stringify for proper options comparison

  return { data, loading, error };
};

export default useFetch;

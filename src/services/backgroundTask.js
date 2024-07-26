import { useEffect, useState } from "react";
import { storage } from "./storage";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const storedData = storage.getString("newsData");

    if (storedData) {
      setData(JSON.parse(storedData).articles);
    } else {
      setIsPending(true);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setIsPending(false);
        setData(json.articles);
        storage.set("newsData", JSON.stringify(json));
        setError(null);
      } catch (error) {
        setError(`${error} Could not Fetch Data `);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);
  return { fetchData, data, isPending, error };
};

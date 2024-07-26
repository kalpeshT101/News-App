import { useEffect, useState } from "react";
import { storage } from "./storage";
import {v4 as uuid} from 'uuid'

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    console.log('called')
    const storedData = storage.getString("newsData");
    if (storedData && JSON.parse(storedData).length > 0) {
      const d = JSON.parse(storedData)
      setData(d)
    } else {
      setIsPending(true);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setIsPending(false);
        json.articles.map(news => {
          var ids = "id" + Math.random().toString(16).slice(2)
          news.id = ids;
        })
        setData(json.articles);
        storage.set("newsData", JSON.stringify(json.articles));
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

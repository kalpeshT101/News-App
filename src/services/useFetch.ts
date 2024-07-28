import { useEffect, useState } from "react";
import { storage } from "./storage";
import { addUniqueId } from "utils";

export const useFetch = (url : string) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    const storedData = storage.getString("newsData");
    if (storedData && JSON.parse(storedData).length > 0) {
      setData(JSON.parse(storedData))
    } else {
      setIsPending(true);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        const res = await response.json();
        setIsPending(false);
        const data = addUniqueId(res.articles) // since the api response doesn't containe unique ids which cause issues with flatlist
        setData(data);
        storage.set("newsData", JSON.stringify(data));
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

import { addUniqueId, NEWS_API_URL } from "utils";
import { storage } from "./storage";

export const fetchAndStore = async () => {
  try {
    const response = await fetch(NEWS_API_URL);
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();
    const data = addUniqueId(json.articles)
    storage.set("newsData", JSON.stringify(data));
  } catch (error) {
    console.log(`${error} Could not Fetch Data `);
  }
}
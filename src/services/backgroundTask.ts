import { addUniqueId, NEWS_API_URL } from "utils";
import { storage } from "./storage";

export const fetchAndStore = async () => {
  try {
    const response = await fetch(NEWS_API_URL);
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();
    const data = addUniqueId(json.articles) // since the api response doesn't containe unique ids which cause issues with flatlist
    storage.set("newsData", JSON.stringify(data));
    console.log(data)
  } catch (error) {
    console.log(`${error} Could not Fetch Data `);
  }
}
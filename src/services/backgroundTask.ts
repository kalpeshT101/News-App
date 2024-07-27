import { NEWS_API_URL } from "utils";
import { storage } from "./storage";

export const fetchAndStore = async () => {
  try {
    const response = await fetch(NEWS_API_URL);
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();
    json.articles.map((news: any) => {
      var ids = "id" + Math.random().toString(16).slice(2)
      news.id = ids;
    })
    storage.set("newsData", JSON.stringify(json.articles));
  } catch (error) {
    console.log(`${error} Could not Fetch Data `);
  }
}
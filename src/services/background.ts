import { storage } from "./storage";

export const fetchAndStore = async () => {
  try {
    const response = await fetch(
    "https://newsapi.org/v2/everything?page=1&pageSize=20&domains=bbc.co.uk,techcrunch.com,engadget.com&apiKey=8d8e62acd6c248109eafe31fef011b3e",
    );
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();
    json.articles.map((news: any) => {
      var ids = "id" + Math.random().toString(16).slice(2)
      news.id = ids;
    })
    console.log(json.articles)
    storage.set("newsData", JSON.stringify(json.articles));
  } catch (error) {
    console.log(`${error} Could not Fetch Data `);
  }
}
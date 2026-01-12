import axios from "axios";

export async function scrapeWebsite(url) {
  const res = await axios.post(
    "https://api.firecrawl.dev/v1/scrape",
    {
      url,
      formats: ["markdown"],
      onlyMainContent: true
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 60000,
    }
  );

  const md = res?.data?.data?.markdown || res?.data?.markdown || "";
  return md;
}

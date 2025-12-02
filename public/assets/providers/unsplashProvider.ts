// src/assets/providers/unsplashProvider.ts
import type { SidebarAsset, AssetProvider } from "../types";

export const UnsplashProvider = (accessKey: string): AssetProvider => {
  return {
    async search(query: string, page = 1): Promise<SidebarAsset[]> {
      const trimmed = query.trim();

      // Choose endpoint based on query
      const endpoint = trimmed
        ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(trimmed)}&page=${page}&client_id=${accessKey}`
        : `https://api.unsplash.com/photos?page=${page}&client_id=${accessKey}`;

      try {
        const res = await fetch(endpoint);

        if (!res.ok) {
          if (res.status === 403) {
            //console.error("Unsplash API error: 403 — invalid key or unauthorized request.");
          } else if (res.status === 401) {
            //console.error("Unsplash API error: 401 — missing or expired key.");
          } else if (res.status === 429) {
            //console.error("Unsplash API error: 429 — rate limit exceeded.");
          } else {
            //console.error("Unsplash API error:", res.status, res.statusText);
          }
          return [];
        }

        const data = await res.json();

        // Handle both search and feed response shapes
        const results = Array.isArray(data) ? data : data.results;
        if (!results || !Array.isArray(results)) {
          console.warn("Unexpected Unsplash response shape:", data);
          return [];
        }

        return results.map((item: any) => ({
          id: item.id,
          kind: "image",
          src: item.urls.thumb,
          fullSrc: item.urls.full,
          title: item.description || item.alt_description || "Untitled",
          author: item.user?.name || "Unknown",
          source: "unsplash",
          width: item.width,
          height: item.height,
          license: "Unsplash License",
        }));
      } catch (err) {
        console.error("Unsplash fetch failed:", err);
        return [];
      }
    },
  };
};

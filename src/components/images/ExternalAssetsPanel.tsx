// src/components/images/ExternalAssetsPanel.tsx
import React, { useEffect, useMemo, useState } from "react";
import { SidebarAsset } from "@/public/assets/types";
import { UnsplashProvider } from "@/public/assets/providers/unsplashProvider";

type ExternalAssetsPanelProps = {
  onSelect: (asset: SidebarAsset) => void; // open preview modal or drag-start
  provider?: "unsplash";                   // future: "pexels" | "local"
};

export const ExternalAssetsPanel: React.FC<ExternalAssetsPanelProps> = ({
  onSelect,
  provider = "unsplash",
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SidebarAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const assetProvider = useMemo(() => {
    switch (provider) {
      case "unsplash":
      default: {
        const key = process.env.NEXT_PUBLIC_UNSPLASH_KEY;
        if (!key) {
          console.error("Unsplash access key is missing. Set NEXT_PUBLIC_UNSPLASH_KEY in your environment.");
        }
        return UnsplashProvider(key ?? "");
      }
    }
  }, [provider]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setIsLoading(true);
      try {
        const assets = await assetProvider.search(query || "nature");
        if (mounted) setResults(assets);
      } catch (err) {
        console.error("Asset provider search failed:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [assetProvider, query]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stock images..."
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      {isLoading && <div className="text-sm text-gray-500">Searching…</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {results.map((a) => (
          <button
            key={a.id}
            onClick={() => onSelect(a)}
            className="relative group rounded overflow-hidden border hover:border-gray-400"
            draggable
            onDragStart={(e) => {
              // Provide a small image for drag ghost
              const img = document.createElement("img");
              img.src = a.src;
              e.dataTransfer.setDragImage(img, 10, 10);
              e.dataTransfer.setData("image-src", a.fullSrc || a.src);
            }}
          >
            <img
              src={a.src}
              alt={a.title || "asset"}
              className="w-full h-auto block"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
            <div className="absolute bottom-0 left-0 right-0 p-1 text-[11px] text-white bg-black/40 opacity-0 group-hover:opacity-100 transition">
              {a.width && a.height ? `${a.width}×${a.height}` : ""}{" "}
              {a.author ? `• ${a.author}` : ""}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

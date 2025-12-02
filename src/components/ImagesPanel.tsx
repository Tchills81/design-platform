import { useState, useEffect } from "react";

import { UnsplashProvider } from "@/public/assets/providers/unsplashProvider";
import { SidebarAsset } from "@/public/assets/types";
import { ToneButton } from "./ToneButton";
import { CloudUpload } from "lucide-react";

type ImagesPanelProps = {
  onImageDrop: (src: string, role: "element" | "background") => void;
  setSelectedAsset: (asset: SidebarAsset | null )=>void; 
};

export function ImagesPanel({ onImageDrop, setSelectedAsset }: ImagesPanelProps) {
  const [query, setQuery] = useState("nature"); // default keyword
  const [localImages] = useState<string[]>([
    "/assets/tonva-winter.png",
    "/assets/tonva-spring.png",
    "/assets/tonva-summer.png",
    "/assets/tonva-spring.png",
  ]);

  const [stockImages, setStockImages] = useState<SidebarAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const provider = UnsplashProvider(process.env.NEXT_PUBLIC_UNSPLASH_KEY!);

  // Fetch stock images whenever query or page changes
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setStockImages([]);
      return;
    }

    let mounted = true;
    const run = async () => {
      setIsLoading(true);
      try {
        const results = await provider.search(trimmed, page);
        if (mounted) {
          setStockImages(prev => {
            const combined = page === 1 ? results : [...prev, ...results];
            // Deduplicate by id
            const seen = new Set<string>();
            return combined.filter(asset => {
              if (seen.has(asset.id)) return false;
              seen.add(asset.id);
              return true;
            });
          });
        }
      } catch (err) {
        console.error("Unsplash fetch failed:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [query, page]);

  const handleDragStartLocal = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("image-src", id);
  };

  const handleDragStartStock = (e: React.DragEvent<HTMLDivElement>, asset: SidebarAsset) => {
    e.dataTransfer.setData("image-src", asset.fullSrc || asset.src);
  };

  return (
    <div style={{ padding: "1rem", overflowY: "auto", height: "100%", background: "#fff" }}>
      {/* Unified search bar */}
      <input
        type="text"
        placeholder="Search local + stock images..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1); // reset to first page on new query
        }}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          border: "1px solid #e2e8f0",
          borderRadius: 4,
        }}
      />

      {/* Local assets */}
      <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        Local assets
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {localImages
          .filter((src) => src.toLowerCase().includes(query.toLowerCase()))
          .map((src, i) => (
            <div
              key={i}
              style={{
                width: "100%",
                height: 80,
                borderRadius: 4,
                cursor: "grab",
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              draggable
              onDragStart={(e) => handleDragStartLocal(e, src)}
            />
          ))}
      </div>

      {/* Stock assets */}
      <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        Stock images (Unsplash)
      </h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {stockImages.map((asset) => (
          <div
            key={asset.id}
            style={{
              width: "100%",
              height: 100,
              borderRadius: 4,
              cursor: "grab",
              backgroundImage: `url(${asset.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              opacity: 0,
              animation: "fadeIn 0.5s forwards",
            }}
            draggable
            onDragStart={(e) => handleDragStartStock(e, asset)}
           // onClick={() => onImageDrop(asset.fullSrc || asset.src)}
           onClick={() => setSelectedAsset(asset)}

          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                fontSize: "0.7rem",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                padding: "2px 4px",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
              className="hover:opacity-100"
            >
              {asset.author}
            </div>
          </div>
        ))}
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
          Loading…
        </div>
      )}

      {/* Load more button */}
      {!isLoading && stockImages.length > 0 && (
        <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          paddingBottom: "1.5rem", // 👈 extra space at bottom
        }}
      >


          <ToneButton 
           icon={<CloudUpload/>}
            label="Load more"
            onClick={() => setPage((p) => p + 1)}/>

        </div>
      )}

      {/* Fade-in keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

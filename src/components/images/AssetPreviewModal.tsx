import { SidebarAsset } from "@/public/assets/types";
import { ToneButton } from "../ToneButton";
import { Atom, Component, Image } from "lucide-react";

type AssetPreviewModalProps = {
  selectedAsset: SidebarAsset | null;
  setSelectedAsset: (asset: SidebarAsset | null) => void;
  onImageDrop: (src: string, role: "element" | "background") => void;
};

export function AssetPreviewModal({
  selectedAsset,
  setSelectedAsset,
  onImageDrop,
}: AssetPreviewModalProps) {
  if (!selectedAsset) return null;

  const src = selectedAsset.fullSrc || selectedAsset.src;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={() => setSelectedAsset(null)}
    >
      <div
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: 8,
          maxWidth: "90vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ flex: 1, overflowY: "auto" }}>
          <img
            src={src}
            alt={selectedAsset.title}
            style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 4 }}
          />
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            {selectedAsset.title} — by {selectedAsset.author}
          </p>
        </div>

        {/* Footer with two buttons */}
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
          }}
        >
        
        <ToneButton
           icon={<Image/>}
            label="Use as element"
            onClick={() => {
                onImageDrop(src, "element");
                setSelectedAsset(null);
              }}/>

          <ToneButton
           icon={<Component/>}
            label="Use as background"
            onClick={() => {
                onImageDrop(src, "background");
                setSelectedAsset(null);
          }}/>
        
          
        </div>
      </div>
    </div>
  );
}

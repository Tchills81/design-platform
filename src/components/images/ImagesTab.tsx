// src/components/images/ImagesTab.tsx
import React from "react";
import { ExternalAssetsPanel } from "./ExternalAssetsPanel";

type ImagesTabProps = {
  setPreviewSrc: (src: string | null) => void;
  setPreviewRole: (role: "background" | "element") => void;
};

export const ImagesTab: React.FC<ImagesTabProps> = ({
  setPreviewSrc,
  setPreviewRole,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Existing Uploads / Library sections here */}

      <section>
        <h4 className="text-sm font-semibold mb-2">Stock images</h4>
        <ExternalAssetsPanel
          onSelect={(asset) => {
            setPreviewSrc(asset.fullSrc || asset.src);
            setPreviewRole("background"); // default; user can override via RoleSelect
          }}
        />
      </section>
    </div>
  );
};

// src/assets/types.ts
export type AssetKind = "image";

export type SidebarAsset = {
  id: string;
  kind: AssetKind;
  src: string;          // thumbnail or small preview
  fullSrc?: string;     // full-size for canvas or preview
  title?: string;
  author?: string;
  source?: "unsplash" | "pexels" | "local";
  width?: number;
  height?: number;
  license?: string;
  href?: string; // ✅ add optional link
};

export interface AssetProvider {
  search(query: string, page?: number): Promise<SidebarAsset[]>;
  getById?(id: string): Promise<SidebarAsset | null>;
}

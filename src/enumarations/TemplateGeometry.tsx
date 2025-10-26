import { TemplateSize } from "./TemplateSize";

export const TemplateGeometry: Record<TemplateSize, { width: number; height: number; defaultCellSize: number }> = {
  [TemplateSize.POSTCARD]: { width: 700, height: 400, defaultCellSize: 64 },
  [TemplateSize.GIFT_CARD_SMALL]: { width: 400, height: 250, defaultCellSize: 20 },
  [TemplateSize.POSTER_WIDE]: { width: 1000, height: 600, defaultCellSize: 80 },
  [TemplateSize.PORTRAIT_POSTCARD]: { width: 400, height: 600, defaultCellSize: 64 },

  [TemplateSize.INSTAGRAM_POST]: { width: 1080, height: 1350, defaultCellSize: 64 },
  [TemplateSize.INSTAGRAM_STORY]: { width: 1080, height: 1920, defaultCellSize: 64 },
  [TemplateSize.FLYER_PORTRAIT]: { width: 794, height: 1123, defaultCellSize: 64 },
  [TemplateSize.FLYER_LANDSCAPE]: { width: 1123, height: 794, defaultCellSize: 64 },
  [TemplateSize.PRESENTATION]: { width: 1920, height: 1080, defaultCellSize: 80 },
  [TemplateSize.MOBILE_VIDEO_PORTRAIT]: { width: 1080, height: 1920, defaultCellSize: 64 },
  [TemplateSize.MOBILE_VIDEO_LANDSCAPE]: { width: 1920, height: 1080, defaultCellSize: 80 },

  [TemplateSize.CARD_LANDSCAPE]: { width: 1480, height: 1050, defaultCellSize: 64 },
  [TemplateSize.CARD_SQUARE]: { width: 1080, height: 1080, defaultCellSize: 64 },
  [TemplateSize.BUSINESS_CARD]: { width: 1050, height: 600, defaultCellSize: 64 },
  [TemplateSize.INVITE_A6]: { width: 1050, height: 1480, defaultCellSize: 64 },
  [TemplateSize.POSTER_PORTRAIT]: { width: 794, height: 1123, defaultCellSize: 64 },
  [TemplateSize.GREETING_SQUARE]: { width: 1080, height: 1080, defaultCellSize: 64 },

  [TemplateSize.BANNER_WIDE]: { width: 1920, height: 600, defaultCellSize: 80 },
  [TemplateSize.BANNER_TALL]: { width: 600, height: 1920, defaultCellSize: 64 },
  [TemplateSize.ANNOUNCEMENT_SQUARE]: { width: 1200, height: 1200, defaultCellSize: 64 },
  [TemplateSize.PROMO_PORTRAIT]: { width: 900, height: 1600, defaultCellSize: 64 },
  [TemplateSize.PROMO_LANDSCAPE]: { width: 1600, height: 900, defaultCellSize: 64 }
};

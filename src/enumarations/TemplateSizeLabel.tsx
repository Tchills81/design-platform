import { TemplateSize } from "./TemplateSize";

export const TemplateSizeLabel: Record<TemplateSize, string> = {
  [TemplateSize.POSTCARD]: 'Postcard (6×4 in)',
  [TemplateSize.GIFT_CARD_SMALL]: 'Gift Card (Small)',
  [TemplateSize.POSTER_WIDE]: 'Poster (Wide)',
  [TemplateSize.PORTRAIT_POSTCARD]: 'Postcard (Portrait)',

  [TemplateSize.INSTAGRAM_POST]: 'Instagram Post (4:5)',
  [TemplateSize.INSTAGRAM_STORY]: 'Instagram Story',
  [TemplateSize.FLYER_PORTRAIT]: 'Flyer (Portrait)',
  [TemplateSize.FLYER_LANDSCAPE]: 'Flyer (Landscape)',
  [TemplateSize.PRESENTATION]: 'Presentation (16:9)',
  [TemplateSize.MOBILE_VIDEO_PORTRAIT]: 'Mobile Video (Portrait)',
  [TemplateSize.MOBILE_VIDEO_LANDSCAPE]: 'Mobile Video (Landscape)',

  [TemplateSize.CARD_LANDSCAPE]: 'Card (Landscape)',
  [TemplateSize.CARD_SQUARE]: 'Card (Square)',
  [TemplateSize.BUSINESS_CARD]: 'Business Card',
  [TemplateSize.INVITE_A6]: 'Invite (A6)',
  [TemplateSize.POSTER_PORTRAIT]: 'Poster (Portrait)',
  [TemplateSize.GREETING_SQUARE]: 'Greeting (Square)',

  [TemplateSize.BANNER_WIDE]: 'Banner (Wide)',
  [TemplateSize.BANNER_TALL]: 'Banner (Tall)',
  [TemplateSize.ANNOUNCEMENT_SQUARE]: 'Announcement (Square)',
  [TemplateSize.PROMO_PORTRAIT]: 'Promo (Portrait)',
  [TemplateSize.PROMO_LANDSCAPE]: 'Promo (Landscape)'
};

export enum TemplateSize {
  POSTCARD = 'postcard',
  GIFT_CARD_SMALL = 'gift-card-small',
  POSTER_WIDE = 'poster-wide',
  PORTRAIT_POSTCARD = 'portrait-postcard',

  INSTAGRAM_POST = 'instagram-post',               // 1080x1350 (4:5)
  INSTAGRAM_STORY = 'instagram-story',             // 1080x1920
  FLYER_PORTRAIT = 'flyer-portrait',               // A4 approx
  FLYER_LANDSCAPE = 'flyer-landscape',
  PRESENTATION = 'presentation',                   // 1920x1080
  MOBILE_VIDEO_PORTRAIT = 'mobile-video-portrait', // 1080x1920
  MOBILE_VIDEO_LANDSCAPE = 'mobile-video-landscape', // 1920x1080

  CARD_LANDSCAPE = 'card-landscape',
  CARD_SQUARE = 'card-square',
  BUSINESS_CARD = 'business-card',
  INVITE_A6 = 'invite-a6',
  POSTER_PORTRAIT = 'poster-portrait',
  GREETING_SQUARE = 'greeting-square',

  BANNER_WIDE = 'banner-wide',
  BANNER_TALL = 'banner-tall',
  ANNOUNCEMENT_SQUARE = 'announcement-square',
  PROMO_PORTRAIT = 'promo-portrait',
  PROMO_LANDSCAPE = 'promo-landscape'
}




export const TemplateCategoryMap: Record<TemplateSize, string> = {
  [TemplateSize.POSTCARD]: 'card',
  [TemplateSize.GIFT_CARD_SMALL]: 'card',
  [TemplateSize.POSTER_WIDE]: 'print',
  [TemplateSize.PORTRAIT_POSTCARD]: 'card',

  [TemplateSize.INSTAGRAM_POST]: 'social',
  [TemplateSize.INSTAGRAM_STORY]: 'social',

  [TemplateSize.FLYER_PORTRAIT]: 'flyer',
  [TemplateSize.FLYER_LANDSCAPE]: 'flyer',

  [TemplateSize.PRESENTATION]: 'promo',
  [TemplateSize.MOBILE_VIDEO_PORTRAIT]: 'promo',
  [TemplateSize.MOBILE_VIDEO_LANDSCAPE]: 'promo',

  [TemplateSize.CARD_LANDSCAPE]: 'card',
  [TemplateSize.CARD_SQUARE]: 'card',
  [TemplateSize.BUSINESS_CARD]: 'card',
  [TemplateSize.INVITE_A6]: 'card',
  [TemplateSize.POSTER_PORTRAIT]: 'print',
  [TemplateSize.GREETING_SQUARE]: 'greeting',

  [TemplateSize.BANNER_WIDE]: 'promo',
  [TemplateSize.BANNER_TALL]: 'promo',
  [TemplateSize.ANNOUNCEMENT_SQUARE]: 'announcement',
  [TemplateSize.PROMO_PORTRAIT]: 'promo',
  [TemplateSize.PROMO_LANDSCAPE]: 'promo'
};


// Rotating background behind the hero wordmark. Полностью своя съёмка:
// внешних хотлинков здесь больше нет, первый экран ни от кого не зависит.
//
// Четыре клипа (matcha, coffee, blender, skate) несут водяной знак
// генератора в правом нижнем углу. В hero он не виден: видео идёт с
// прозрачностью 0.6 под градиентом, у которого низ почти непрозрачный.
// Ставить их в секции, где кадр показывается целиком, нельзя — см.
// showcaseVideos.ts.
export const HERO_VIDEOS = [
  "/media/product-show-videos/Girl_eating_chips_and_smiling_202608130004.mp4",
  "/media/product-show-videos/Girl_showing_makeup_palette_202608130012.mp4",
  "/media/product-show-videos/Woman_applying_lip_gloss_202608130008.mp4",
  "/media/product-show-videos/girl_handing_phone_202608130018.mp4",
  "/media/product-show-videos/v2_awv-0a3bbf10df475ddb.mp4",
  "/media/product-show-videos/eyeshadow-palette.mp4",
  "/media/product-show-videos/matcha-set.mp4",
  "/media/product-show-videos/coffee-bag.mp4",
  "/media/product-show-videos/blender.mp4",
  "/media/product-show-videos/skate-deck.mp4",
] as const;

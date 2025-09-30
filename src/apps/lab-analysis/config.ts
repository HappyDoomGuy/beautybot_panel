// config.ts

export interface BannerItem {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl?: string;
}

interface AppConfig {
  enableBanners: boolean;
  bannerItems: BannerItem[];
  defaultAutoplayInterval: number;
}

export const appConfig: AppConfig = {
  enableBanners: true, // Set to false to disable banners
  bannerItems: [
    {
    id: "1",
    imageUrl: 'https://img.lovepik.com/photo/50071/2166.jpg_wh860.jpg', // Replace with your actual image URL
    altText: 'Рекламный баннер о здоровье и медицине',
    linkUrl: 'https://pharmconsilium.com', // Optional: link to a page
  },
  {
    id: "2",
    imageUrl: 'https://img.lovepik.com/photo/50054/5917.jpg_wh860.jpg', // Replace with your actual image URL
    altText: 'Информация о новых медицинских технологиях',
    linkUrl: 'https://pharmconsilium.com',
  },
  {
    id: "3",
    imageUrl: 'https://thumbs.dreamstime.com/b/medical-coverage-insurance-concept-hands-doctor-covering-symbols-icons-blue-background-copy-space-web-banner-template-152592412.jpg', // Replace with your actual image URL
    altText: 'Специальное предложение от аптеки-партнера',
    linkUrl: 'https://pharmconsilium.com',
  },
  ],
  defaultAutoplayInterval: 5000, // milliseconds
};

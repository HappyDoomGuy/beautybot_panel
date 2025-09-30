// components/BannerCarousel.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BannerItem } from '../config'; // Adjusted path

interface BannerCarouselProps {
  banners: BannerItem[];
  autoplayInterval?: number; // in milliseconds
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  autoplayInterval = 7000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayTimerRef = useRef<number | null>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  const totalBanners = banners.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalBanners);
  }, [totalBanners]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const resetAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    if (totalBanners > 1 && autoplayInterval > 0) {
      autoplayTimerRef.current = window.setInterval(goToNext, autoplayInterval);
    }
  }, [goToNext, autoplayInterval, totalBanners]);

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [currentIndex, resetAutoplay]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-[2.5/1] neo neo-outset-deep rounded-2xl overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Рекламные баннеры"
        onMouseEnter={() => { if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current); }}
        onMouseLeave={resetAutoplay}
      >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Отображается баннер {currentIndex + 1} из {totalBanners}: {currentBanner.altText}
        </div>

        {/* Sliding track for banners */}
        <div
          ref={carouselTrackRef}
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="w-full h-full flex-shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`Баннер ${index + 1} из ${totalBanners}`}
              aria-hidden={index !== currentIndex}
            >
              {banner.linkUrl ? (
                <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] focus-visible:ring-[#7e97b8] rounded-2xl">
                  <img
                    src={banner.imageUrl}
                    alt={banner.altText}
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : (
                <img
                  src={banner.imageUrl}
                  alt={banner.altText}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators - positioned below the carousel */}
      {totalBanners > 1 && (
        <div
          className="flex justify-center space-x-2.5 pt-3 sm:pt-4" // Increased space slightly
          role="tablist"
          aria-label="Индикаторы баннеров"
        >
          {banners.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => { goToSlide(index); resetAutoplay(); }}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full neo neo-button transition-all duration-300 ease-in-out
                          focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-[#e0e5ec] focus-visible:ring-[#7e97b8]
                          ${index === currentIndex ? 'active scale-125' : 'neo-outset'}`}
              aria-label={`Перейти к баннеру ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Компонент для ленивой загрузки изображений с использованием Intersection Observer API
 * Изображение загружается только когда становится видимым во viewport
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E',
  className = '',
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer для определения видимости элемента
  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Начинаем загрузку за 50px до появления в viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Загружаем изображение когда оно видимо
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      onError?.();
    };

    img.src = src;
  }, [isInView, src, onLoad, onError]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-50'} transition-opacity duration-300`}
      loading="lazy"
      decoding="async"
    />
  );
};

export default LazyImage;


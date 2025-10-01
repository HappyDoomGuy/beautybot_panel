import { useState, useEffect, RefObject } from 'react';

interface UseLazyLoadOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Хук для ленивой загрузки контента с использованием Intersection Observer API
 * 
 * @param ref - React ref элемента для отслеживания
 * @param options - Опции для Intersection Observer
 * @returns isInView - флаг, показывающий видим ли элемент
 * 
 * @example
 * const MyComponent = () => {
 *   const ref = useRef(null);
 *   const isInView = useLazyLoad(ref);
 *   
 *   return <div ref={ref}>{isInView && <HeavyComponent />}</div>;
 * };
 */
export const useLazyLoad = (
  ref: RefObject<Element>,
  options: UseLazyLoadOptions = {}
): boolean => {
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Отключаем после первого появления
          }
        });
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.root, options.rootMargin, options.threshold]);

  return isInView;
};

/**
 * Хук для предзагрузки изображения
 * 
 * @param src - URL изображения
 * @returns объект с флагами загрузки и ошибки
 * 
 * @example
 * const { isLoaded, hasError } = useImagePreload('/image.jpg');
 */
export const useImagePreload = (src: string) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    img.onerror = () => {
      setIsLoaded(false);
      setHasError(true);
      console.error(`Failed to preload image: ${src}`);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { isLoaded, hasError };
};


/**
 * Утилита для управления загрузкой изображений с поддержкой приоритетов и кэширования
 */

// Глобальный кэш загруженных изображений
const imageCache = new Map<string, HTMLImageElement>();
const loadingPromises = new Map<string, Promise<HTMLImageElement>>();

export type ImagePriority = 'high' | 'low' | 'auto';

export interface LoadImageOptions {
  priority?: ImagePriority;
  timeout?: number;
}

/**
 * Загружает изображение с поддержкой кэширования и приоритетов
 * 
 * @param src - URL изображения
 * @param options - Опции загрузки
 * @returns Promise с загруженным изображением
 */
export const loadImage = (
  src: string,
  options: LoadImageOptions = {}
): Promise<HTMLImageElement> => {
  const { priority = 'auto', timeout = 10000 } = options;

  // Проверяем кэш
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }

  // Проверяем, не загружается ли уже это изображение
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)!;
  }

  // Создаём новый промис загрузки
  const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    // Устанавливаем приоритет загрузки (работает в современных браузерах)
    if ('fetchPriority' in img && priority !== 'auto') {
      (img as any).fetchPriority = priority;
    }

    // Timeout для загрузки
    const timeoutId = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      reject(new Error(`Image loading timeout: ${src}`));
    }, timeout);

    img.onload = () => {
      clearTimeout(timeoutId);
      imageCache.set(src, img);
      loadingPromises.delete(src);
      resolve(img);
    };

    img.onerror = (error) => {
      clearTimeout(timeoutId);
      loadingPromises.delete(src);
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });

  loadingPromises.set(src, loadPromise);
  return loadPromise;
};

/**
 * Загружает несколько изображений параллельно
 * 
 * @param sources - Массив URL изображений
 * @param options - Опции загрузки
 * @returns Promise с массивом результатов (fulfilled или rejected)
 */
export const loadImages = async (
  sources: string[],
  options: LoadImageOptions = {}
): Promise<PromiseSettledResult<HTMLImageElement>[]> => {
  const promises = sources.map(src => loadImage(src, options));
  return Promise.allSettled(promises);
};

/**
 * Предзагрузка изображений с использованием link rel="preload"
 * Более производительный способ для критичных изображений
 * 
 * @param sources - Массив URL изображений
 * @param as - Тип ресурса ('image' по умолчанию)
 */
export const preloadImagesWithLink = (
  sources: string[],
  as: 'image' | 'fetch' = 'image'
): void => {
  sources.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = src;
    document.head.appendChild(link);
  });
};

/**
 * Очищает кэш изображений
 * Полезно для освобождения памяти
 * 
 * @param sources - Опционально: конкретные URL для удаления из кэша
 */
export const clearImageCache = (sources?: string[]): void => {
  if (sources) {
    sources.forEach(src => imageCache.delete(src));
  } else {
    imageCache.clear();
  }
};

/**
 * Получает информацию о кэше
 */
export const getImageCacheInfo = () => {
  return {
    size: imageCache.size,
    sources: Array.from(imageCache.keys()),
  };
};

/**
 * Lazy load изображений с использованием Intersection Observer
 * 
 * @param selector - CSS селектор для изображений
 * @param options - Опции для Intersection Observer
 */
export const enableLazyLoadForSelector = (
  selector: string = 'img[data-lazy]',
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.lazy;
        
        if (src) {
          loadImage(src, { priority: 'low' })
            .then(() => {
              img.src = src;
              img.removeAttribute('data-lazy');
            })
            .catch(err => {
              console.error('Failed to lazy load image:', err);
            });
        }
        
        observer.unobserve(img);
      }
    });
  }, defaultOptions);

  // Наблюдаем за всеми элементами с указанным селектором
  document.querySelectorAll(selector).forEach(img => {
    observer.observe(img);
  });

  return observer;
};


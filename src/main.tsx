import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Random background selection
const backgroundImages = [
  '/hearts.jpg',
  '/image2.jpg',
  '/image3.jpg',
  '/image4.jpg',
  '/image5.jpg',
  '/image6.jpg',
  '/image7.jpg',
  '/image8.jpg',
  '/image9.jpg',
  '/image10.jpg',
  '/image11.jpg',
  '/image12.jpg'
];

// Shuffle array for random order
const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const shuffledBackgrounds = shuffleArray(backgroundImages);
let currentIndex = 0;

// Cache для загруженных изображений
const loadedImages = new Set<string>();
const imageCache = new Map<string, HTMLImageElement>();

// Умная загрузка изображения с кэшированием
const preloadImage = (src: string, priority: 'high' | 'low' = 'low'): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Если уже загружено, сразу резолвим
    if (loadedImages.has(src)) {
      resolve();
      return;
    }

    const img = new Image();
    
    // Используем fetchpriority для браузеров, которые это поддерживают
    if (priority === 'high') {
      img.fetchPriority = 'high';
    }
    
    img.onload = () => {
      loadedImages.add(src);
      imageCache.set(src, img);
      resolve();
    };
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      resolve(); // Резолвим даже при ошибке, чтобы не блокировать
    };
    
    img.src = src;
  });
};

// Загружаем следующее изображение заранее
const preloadNextBackground = () => {
  const nextIndex = (currentIndex + 1) % shuffledBackgrounds.length;
  const nextNextIndex = (currentIndex + 2) % shuffledBackgrounds.length;
  
  // Загружаем следующие 2 фона с низким приоритетом
  preloadImage(shuffledBackgrounds[nextIndex], 'low');
  preloadImage(shuffledBackgrounds[nextNextIndex], 'low');
};

// Set initial background images
document.documentElement.style.setProperty('--background-image-1', `url('${shuffledBackgrounds[0]}')`);
document.documentElement.style.setProperty('--background-image-2', `url('${shuffledBackgrounds[1]}')`);

// Background rotation function
const rotateBackgrounds = () => {
  currentIndex = (currentIndex + 1) % shuffledBackgrounds.length;
  const nextIndex = (currentIndex + 1) % shuffledBackgrounds.length;
  
  // Toggle between the two background layers
  const body = document.body;
  body.classList.toggle('bg-layer-active');
  
  // Preload next image and update the hidden layer
  setTimeout(() => {
    if (body.classList.contains('bg-layer-active')) {
      document.documentElement.style.setProperty('--background-image-1', `url('${shuffledBackgrounds[nextIndex]}')`);
    } else {
      document.documentElement.style.setProperty('--background-image-2', `url('${shuffledBackgrounds[nextIndex]}')`);
    }
    
    // Подгружаем следующие фоны
    preloadNextBackground();
  }, 2000); // Update after transition completes
};

// Start background rotation every 30 seconds
setInterval(rotateBackgrounds, 30000);

// Загружаем только критически важные изображения при старте
const preloadCriticalResources = () => {
  return Promise.all([
    preloadImage(shuffledBackgrounds[0], 'high'), // Текущий фон
    preloadImage(shuffledBackgrounds[1], 'high'), // Следующий фон
  ]);
};

// Загружаем остальные изображения в фоне с низким приоритетом
const preloadRemainingResources = () => {
  // Используем requestIdleCallback для загрузки в свободное время
  const loadRemaining = () => {
    for (let i = 2; i < shuffledBackgrounds.length; i++) {
      preloadImage(shuffledBackgrounds[i], 'low');
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadRemaining, { timeout: 2000 });
  } else {
    // Fallback для браузеров без поддержки requestIdleCallback
    setTimeout(loadRemaining, 2000);
  }
};

// Initialize app
const initApp = async () => {
  // Render app immediately
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  // Wait only for critical resources (first 2 backgrounds)
  await Promise.all([
    preloadCriticalResources(),
    new Promise(resolve => setTimeout(resolve, 500)) // Minimum display time (reduced from 1000ms)
  ]);
  
  // Hide loading screen with smooth transition
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
  
  // Load remaining images in the background after app is ready
  preloadRemainingResources();
};

// Start initialization
initApp();

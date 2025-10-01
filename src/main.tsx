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
  }, 2000); // Update after transition completes
};

// Start background rotation every 30 seconds
setInterval(rotateBackgrounds, 30000);

// Preload background images and other critical resources
const preloadResources = () => {
  return new Promise((resolve) => {
    const imagesToLoad: string[] = backgroundImages;
    let loadedCount = 0;
    const totalImages = imagesToLoad.length;
    
    if (totalImages === 0) {
      resolve(true);
      return;
    }
    
    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          resolve(true);
        }
      };
      img.src = src;
    });
  });
};

// Initialize app
const initApp = async () => {
  // Render app
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  // Wait for resources to load
  await Promise.all([
    preloadResources(),
    new Promise(resolve => setTimeout(resolve, 1000)) // Minimum display time
  ]);
  
  // Hide loading screen with smooth transition
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
};

// Start initialization
initApp();

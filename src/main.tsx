import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Random background selection
const backgroundImages = ['/hearts.jpg', '/image2.jpg'];
const selectedBackground = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

// Set CSS variable for background image
document.documentElement.style.setProperty('--background-image', `url('${selectedBackground}')`);

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

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// Add improved service worker handling
if ('serviceWorker' in navigator) {
  // Wait for the app to load completely
  window.addEventListener('load', () => {
    // Add a small delay to ensure everything is loaded
    setTimeout(() => {
      navigator.serviceWorker.ready.then(registration => {
        console.log('Service worker is active and ready for PWA installation');
        
        // Force update check on each load
        registration.update();
      }).catch(error => {
        console.error('Service worker ready error:', error);
      });
    }, 1000);
    
    // Log when service worker changes state
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed - new version available');
    });
  });
}

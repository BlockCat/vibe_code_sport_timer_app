import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtendedNotificationOptions, NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showPrompt" class="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t border-gray-200 z-50 transition-transform transform ease-in-out duration-300" [class.translate-y-full]="!showPrompt">
      <div class="max-w-lg mx-auto">
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <div class="mr-3 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h3 class="text-md font-medium">Stay on track with notifications</h3>
              <p class="text-sm text-gray-600 mt-1">Get reminders for your workouts and achievements</p>
            </div>
          </div>
          <button (click)="dismiss()" class="text-gray-400 hover:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="mt-3 flex space-x-2">
          <button 
            (click)="enableNotifications()" 
            class="flex-1 py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
            Enable Notifications
          </button>
          <button 
            (click)="dismiss()" 
            class="py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotificationPromptComponent implements OnInit {
  showPrompt = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    // Check if notifications are supported and not already granted or denied
    if ('Notification' in window && Notification.permission === 'default') {
      // Show the prompt after a small delay to let the app load first
      setTimeout(() => {
        // Check if user has already dismissed this prompt before
        const promptDismissed = localStorage.getItem('notification-prompt-dismissed');
        if (!promptDismissed) {
          this.showPrompt = true;
        }
      }, 3000);
    }
  }

  enableNotifications(): void {
    this.notificationService.requestPermission().then((granted: boolean) => {
      this.showPrompt = false;
      
      if (granted) {
        // If permission was granted, show a welcome notification
        this.notificationService.scheduleNotification(
          'Notifications Enabled',
          {
            body: 'You\'ll now receive timely workout reminders and updates!',
            icon: 'icons/icon-192x192.png'
          } as ExtendedNotificationOptions
        );
      }
    });
  }

  dismiss(): void {
    this.showPrompt = false;
    // Remember that the user dismissed the prompt
    localStorage.setItem('notification-prompt-dismissed', 'true');
  }
}
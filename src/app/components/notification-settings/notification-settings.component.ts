import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService, NotificationSettings, ExtendedNotificationOptions } from '../../services/notification.service';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 bg-white rounded-lg shadow-md">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">Notifications</h2>
        <button 
          *ngIf="!hasPermission" 
          (click)="requestPermission()" 
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Enable Notifications
        </button>
        <span *ngIf="hasPermission" class="text-green-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Enabled
        </span>
      </div>

      <div *ngIf="!notificationsSupported" class="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
        Your browser doesn't support notifications.
      </div>
      
      <div *ngIf="hasPermission && notificationsSupported" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">Workout Reminders</h3>
            <p class="text-sm text-gray-600">Get notified when it's time for a scheduled workout</p>
          </div>
          <div class="relative inline-block w-12 align-middle select-none">
            <input 
              type="checkbox" 
              id="workout-toggle" 
              class="sr-only"
              [(ngModel)]="settings.workoutReminders"
              (change)="updateSettings()" />
            <label 
              for="workout-toggle"
              class="block h-6 overflow-hidden rounded-full bg-gray-300 cursor-pointer"
              [class.bg-indigo-600]="settings.workoutReminders">
              <span 
                class="block h-6 w-6 rounded-full bg-white transform transition-transform" 
                [class.translate-x-6]="settings.workoutReminders"></span>
            </label>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">Inactivity Reminders</h3>
            <p class="text-sm text-gray-600">Gentle nudges if you haven't worked out recently</p>
          </div>
          <div class="relative inline-block w-12 align-middle select-none">
            <input 
              type="checkbox" 
              id="inactivity-toggle" 
              class="sr-only"
              [(ngModel)]="settings.inactivityReminders"
              (change)="updateSettings()" />
            <label 
              for="inactivity-toggle"
              class="block h-6 overflow-hidden rounded-full bg-gray-300 cursor-pointer"
              [class.bg-indigo-600]="settings.inactivityReminders">
              <span 
                class="block h-6 w-6 rounded-full bg-white transform transition-transform" 
                [class.translate-x-6]="settings.inactivityReminders"></span>
            </label>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">Achievement Notifications</h3>
            <p class="text-sm text-gray-600">Celebrate when you reach fitness milestones</p>
          </div>
          <div class="relative inline-block w-12 align-middle select-none">
            <input 
              type="checkbox" 
              id="achievement-toggle" 
              class="sr-only"
              [(ngModel)]="settings.achievementNotifications"
              (change)="updateSettings()" />
            <label 
              for="achievement-toggle"
              class="block h-6 overflow-hidden rounded-full bg-gray-300 cursor-pointer"
              [class.bg-indigo-600]="settings.achievementNotifications">
              <span 
                class="block h-6 w-6 rounded-full bg-white transform transition-transform" 
                [class.translate-x-6]="settings.achievementNotifications"></span>
            </label>
          </div>
        </div>
      </div>

      <div *ngIf="!hasPermission && notificationsSupported" class="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
        Enable notifications to get timely reminders about your workouts and achievements.
      </div>

      <div class="mt-4">
        <button 
          (click)="testNotification()"
          [disabled]="!hasPermission || !notificationsSupported" 
          class="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          [class.opacity-50]="!hasPermission || !notificationsSupported">
          Test Notification
        </button>
      </div>
    </div>
  `
})
export class NotificationSettingsComponent implements OnInit {
  settings: NotificationSettings = {
    workoutReminders: true,
    inactivityReminders: true,
    achievementNotifications: true
  };
  
  hasPermission = false;
  notificationsSupported = false;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationsSupported = 'Notification' in window;
    
    this.notificationService.hasPermission.subscribe((granted: boolean) => {
      this.hasPermission = granted;
    });

    this.notificationService.settings.subscribe((settings: NotificationSettings) => {
      this.settings = { ...settings };
    });
  }

  requestPermission(): void {
    this.notificationService.requestPermission().then((granted: boolean) => {
      this.hasPermission = granted;
    });
  }

  updateSettings(): void {
    this.notificationService.updateSettings(this.settings);
  }

  testNotification(): void {
    this.notificationService.scheduleNotification(
      'Test Notification',
      {
        body: 'Your notifications are working correctly!',
        icon: 'icons/icon-192x192.png',
        badge: 'icons/icon-72x72.png',
        vibrate: [100, 50, 100]
      } as ExtendedNotificationOptions
    );
  }
}
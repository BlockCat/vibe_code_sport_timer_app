import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationSettings {
  workoutReminders: boolean;
  inactivityReminders: boolean;
  achievementNotifications: boolean;
}

export interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  actions?: NotificationAction[];
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private permissionGranted = new BehaviorSubject<boolean>(false);
  private notificationSettings = new BehaviorSubject<NotificationSettings>({
    workoutReminders: true,
    inactivityReminders: true,
    achievementNotifications: true
  });

  constructor() {
    this.checkNotificationPermission();
    this.loadSettings();
  }

  private checkNotificationPermission(): void {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      this.permissionGranted.next(true);
    } else if (Notification.permission !== 'denied') {
      this.requestPermission();
    }
  }

  public requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return Promise.resolve(false);
    }

    return Notification.requestPermission()
      .then(permission => {
        const granted = permission === 'granted';
        this.permissionGranted.next(granted);
        return granted;
      })
      .catch(error => {
        console.error('Error requesting notification permission:', error);
        return false;
      });
  }

  public get hasPermission(): Observable<boolean> {
    return this.permissionGranted.asObservable();
  }

  public get settings(): Observable<NotificationSettings> {
    return this.notificationSettings.asObservable();
  }

  public updateSettings(settings: Partial<NotificationSettings>): void {
    const currentSettings = this.notificationSettings.value;
    const newSettings = { ...currentSettings, ...settings };
    this.notificationSettings.next(newSettings);
    this.saveSettings(newSettings);
  }

  public scheduleNotification(title: string, options: ExtendedNotificationOptions, delayInMinutes = 0): void {
    if (!this.permissionGranted.value) {
      console.log('Notification permission not granted');
      return;
    }

    if (delayInMinutes > 0) {
      setTimeout(() => {
        this.showNotification(title, options);
      }, delayInMinutes * 60 * 1000);
    } else {
      this.showNotification(title, options);
    }
  }

  public scheduleWorkoutReminder(workoutName: string, delayInMinutes: number): void {
    if (!this.notificationSettings.value.workoutReminders) {
      return;
    }

    this.scheduleNotification(
      'Workout Reminder',
      {
        body: `Time for your ${workoutName} workout!`,
        icon: 'icons/icon-192x192.png',
        badge: 'icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        tag: 'workout-reminder',
        actions: [
          { action: 'start', title: 'Start Now' },
          { action: 'snooze', title: 'Later' }
        ]
      },
      delayInMinutes
    );
  }

  public showInactivityReminder(daysInactive: number): void {
    if (!this.notificationSettings.value.inactivityReminders) {
      return;
    }

    this.showNotification(
      'Missing Your Workouts',
      {
        body: `It's been ${daysInactive} days since your last workout. Ready to get back on track?`,
        icon: 'icons/icon-192x192.png',
        badge: 'icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        tag: 'inactivity-reminder'
      }
    );
  }

  public showAchievementNotification(achievement: string): void {
    if (!this.notificationSettings.value.achievementNotifications) {
      return;
    }

    this.showNotification(
      'Achievement Unlocked!',
      {
        body: achievement,
        icon: 'icons/icon-192x192.png',
        badge: 'icons/icon-72x72.png',
        vibrate: [100, 50, 100, 200, 100],
        tag: 'achievement'
      }
    );
  }

  public showNotification(title: string, options: ExtendedNotificationOptions): void {
    if ('Notification' in window && this.permissionGranted.value) {
      try {
        // Cast to any to avoid TypeScript errors with non-standard properties
        const notification = new Notification(title, options as any);
        
        if (options.actions) {
          notification.onclick = (event) => {
            const action = (event as any).action;
            if (action === 'start') {
              // Navigate to workout page
              window.location.href = '/workout';
            }
          };
        }
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }

  private saveSettings(settings: NotificationSettings): void {
    try {
      localStorage.setItem('notification-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('notification-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.notificationSettings.next(settings);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }
}
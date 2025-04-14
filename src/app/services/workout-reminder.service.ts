import { Injectable } from '@angular/core';
import { NotificationService } from '../services/notification.service';

export interface ScheduledWorkout {
  id: string;
  name: string;
  scheduledTime: Date;
  reminderSent: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutReminderService {
  private scheduledWorkouts: ScheduledWorkout[] = [];
  private storageKey = 'scheduled-workouts';
  
  constructor(private notificationService: NotificationService) {
    this.loadScheduledWorkouts();
    this.checkForUpcomingWorkouts();
    
    // Check for upcoming workouts every minute
    setInterval(() => this.checkForUpcomingWorkouts(), 60000);
  }
  
  /**
   * Schedule a workout reminder
   * @param id Workout ID
   * @param name Workout name
   * @param date Date and time for the workout
   * @param reminderMinutesBefore How many minutes before to send the reminder
   */
  scheduleWorkout(id: string, name: string, date: Date, reminderMinutesBefore = 15): void {
    // Calculate reminder time
    const reminderTime = new Date(date);
    reminderTime.setMinutes(reminderTime.getMinutes() - reminderMinutesBefore);
    
    const workout: ScheduledWorkout = {
      id,
      name,
      scheduledTime: date,
      reminderSent: false
    };
    
    this.scheduledWorkouts.push(workout);
    this.saveScheduledWorkouts();
    
    // If reminder time is in the future, schedule it
    const now = new Date();
    if (reminderTime > now) {
      const minutesUntilReminder = Math.floor((reminderTime.getTime() - now.getTime()) / 60000);
      this.notificationService.scheduleWorkoutReminder(name, minutesUntilReminder);
    }
  }
  
  /**
   * Get all scheduled workouts
   */
  getScheduledWorkouts(): ScheduledWorkout[] {
    return [...this.scheduledWorkouts]
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }
  
  /**
   * Delete a scheduled workout
   */
  cancelWorkout(id: string, scheduledTime: Date): void {
    this.scheduledWorkouts = this.scheduledWorkouts.filter(
      workout => !(workout.id === id && workout.scheduledTime.getTime() === scheduledTime.getTime())
    );
    this.saveScheduledWorkouts();
  }
  
  /**
   * Check for upcoming workouts and send notifications
   */
  private checkForUpcomingWorkouts(): void {
    const now = new Date();
    let updated = false;
    
    this.scheduledWorkouts.forEach(workout => {
      // If the workout is within 15 minutes and reminder hasn't been sent
      const timeDiff = workout.scheduledTime.getTime() - now.getTime();
      const minutesUntil = Math.floor(timeDiff / 60000);
      
      if (minutesUntil <= 15 && minutesUntil > 0 && !workout.reminderSent) {
        this.notificationService.scheduleWorkoutReminder(workout.name, 0);
        workout.reminderSent = true;
        updated = true;
      }
      
      // Clean up past workouts (older than a day)
      if (timeDiff < -86400000) { // 24 hours in milliseconds
        this.scheduledWorkouts = this.scheduledWorkouts.filter(w => w !== workout);
        updated = true;
      }
    });
    
    if (updated) {
      this.saveScheduledWorkouts();
    }
  }
  
  /**
   * Save scheduled workouts to local storage
   */
  private saveScheduledWorkouts(): void {
    try {
      const serialized = JSON.stringify(this.scheduledWorkouts.map(workout => ({
        ...workout,
        scheduledTime: workout.scheduledTime.toISOString()
      })));
      localStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      console.error('Error saving scheduled workouts:', error);
    }
  }
  
  /**
   * Load scheduled workouts from local storage
   */
  private loadScheduledWorkouts(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.scheduledWorkouts = parsed.map((workout: any) => ({
          ...workout,
          scheduledTime: new Date(workout.scheduledTime)
        }));
      }
    } catch (error) {
      console.error('Error loading scheduled workouts:', error);
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkoutReminderService, ScheduledWorkout } from '../../services/workout-reminder.service';
import { NotificationService, ExtendedNotificationOptions } from '../../services/notification.service';

@Component({
  selector: 'app-scheduled-workouts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6 flex items-center">
        <a routerLink="/" class="text-indigo-600 hover:text-indigo-800 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <h1 class="text-2xl font-bold">Scheduled Workouts</h1>
      </div>
      
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        @if (scheduledWorkouts.length === 0) {
          <div class="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 class="text-xl font-medium mt-4">No scheduled workouts</h2>
            <p class="text-gray-600 mt-2">
              When you schedule workouts, they'll appear here.
            </p>
            <a 
              routerLink="/" 
              class="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Find a Workout
            </a>
          </div>
        } @else {
          <ul class="divide-y divide-gray-200">
            @for (workout of scheduledWorkouts; track workout) {
              <li class="p-4">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ workout.name }}</h3>
                    <div class="text-sm text-gray-600 mt-1">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(workout.scheduledTime) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <a 
                      [routerLink]="['/training', workout.id]" 
                      class="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors">
                      Start
                    </a>
                    <button 
                      (click)="cancelWorkout(workout)" 
                      class="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `
})
export class ScheduledWorkoutsComponent implements OnInit {
  scheduledWorkouts: ScheduledWorkout[] = [];
  
  constructor(
    private workoutReminderService: WorkoutReminderService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    this.loadScheduledWorkouts();
  }
  
  loadScheduledWorkouts(): void {
    this.scheduledWorkouts = this.workoutReminderService.getScheduledWorkouts();
  }
  
  cancelWorkout(workout: ScheduledWorkout): void {
    this.workoutReminderService.cancelWorkout(workout.id, workout.scheduledTime);
    this.loadScheduledWorkouts();
    
    this.notificationService.scheduleNotification(
      'Workout Cancelled',
      {
        body: `${workout.name} has been removed from your schedule`,
        icon: 'icons/icon-192x192.png'
      } as ExtendedNotificationOptions
    );
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }
}
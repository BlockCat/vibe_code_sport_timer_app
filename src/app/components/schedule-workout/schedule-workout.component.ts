import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutReminderService } from '../../services/workout-reminder.service';
import { NotificationService, ExtendedNotificationOptions } from '../../services/notification.service';

@Component({
  selector: 'app-schedule-workout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full" (click)="$event.stopPropagation()">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Schedule Workout</h2>
            <button (click)="close()" class="text-gray-400 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-gray-600 mb-6">Schedule "{{ workoutName }}" for later and receive a notification when it's time to work out.</p>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2" for="date">
                Date
              </label>
              <input 
                type="date" 
                id="date" 
                [(ngModel)]="selectedDate" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                [min]="minDate">
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2" for="time">
                Time
              </label>
              <input 
                type="time" 
                id="time" 
                [(ngModel)]="selectedTime" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2" for="reminder">
                Remind me
              </label>
              <select 
                id="reminder" 
                [(ngModel)]="reminderMinutes" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option [value]="5">5 minutes before</option>
                <option [value]="15">15 minutes before</option>
                <option [value]="30">30 minutes before</option>
                <option [value]="60">1 hour before</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              (click)="close()" 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button 
              (click)="scheduleWorkout()" 
              [disabled]="!isFormValid || !notificationsEnabled"
              [class.opacity-50]="!isFormValid || !notificationsEnabled"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Schedule
            </button>
          </div>
          
          <div *ngIf="!notificationsEnabled" class="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
            <p class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Notifications are disabled. <button (click)="requestNotificationPermission()" class="text-indigo-600 underline">Enable notifications</button> to receive workout reminders.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ScheduleWorkoutComponent implements OnInit {
  @Input() workoutId: string = '';
  @Input() workoutName: string = '';
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();
  
  selectedDate: string = '';
  selectedTime: string = '';
  reminderMinutes: number = 15;
  notificationsEnabled: boolean = false;
  minDate: string = '';
  
  constructor(
    private workoutReminderService: WorkoutReminderService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.selectedDate = this.minDate;
    
    // Set default time to rounded current time + 1 hour
    const hours = today.getHours() + 1;
    const minutes = 0; // Round to nearest hour
    this.selectedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Check if notifications are enabled
    this.notificationService.hasPermission.subscribe((enabled: boolean) => {
      this.notificationsEnabled = enabled;
    });
  }
  
  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }
  
  requestNotificationPermission(): void {
    this.notificationService.requestPermission().then((granted: boolean) => {
      this.notificationsEnabled = granted;
    });
  }
  
  scheduleWorkout(): void {
    if (!this.isFormValid) return;
    
    // Create date from inputs
    const scheduledDate = new Date(`${this.selectedDate}T${this.selectedTime}`);
    
    this.workoutReminderService.scheduleWorkout(
      this.workoutId,
      this.workoutName,
      scheduledDate,
      this.reminderMinutes
    );
    
    // Show confirmation
    this.notificationService.showNotification(
      'Workout Scheduled',
      {
        body: `${this.workoutName} has been scheduled for ${scheduledDate.toLocaleString()}`,
        icon: 'icons/icon-192x192.png'
      } as ExtendedNotificationOptions
    );
    
    this.close();
  }
  
  get isFormValid(): boolean {
    return !!this.selectedDate && !!this.selectedTime;
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationSettingsComponent } from '../../components/notification-settings/notification-settings.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationSettingsComponent],
  template: `
    <div class="w-full max-w-2xl mx-auto">
      <div class="mb-6 flex items-center">
        <a routerLink="/" class="text-indigo-600 hover:text-indigo-800 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <h1 class="text-2xl font-bold">Settings</h1>
      </div>
      
      <div class="space-y-6">
        <app-notification-settings></app-notification-settings>
      </div>
    </div>
  `
})
export class SettingsComponent { }
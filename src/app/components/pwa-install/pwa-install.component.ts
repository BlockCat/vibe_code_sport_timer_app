import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="!isOnline()" class="fixed bottom-0 left-0 right-0 bg-red-500 text-white p-4 text-center z-50">
      You are currently offline. Some features may be limited.
    </div>
    
    <div *ngIf="showInstallBanner()" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-40">
      <div>
        <h3 class="font-medium">Add Sport Timer to Home Screen</h3>
        <p class="text-sm text-gray-600">Install this app for a better experience</p>
      </div>
      <button 
        (click)="installPwa()" 
        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
        Install
      </button>
    </div>
  `
})
export class PwaInstallComponent implements OnInit {
  showInstallBanner = signal(false);
  isOnline = signal(true);
  
  constructor(private pwaService: PwaService) {}
  
  ngOnInit(): void {
    // Check if we can show the install prompt
    this.showInstallBanner.set(!!this.pwaService.promptEvent);
    
    // Update online status
    this.updateOnlineStatus();
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }
  
  installPwa(): void {
    this.pwaService.installPwa();
    this.showInstallBanner.set(false);
  }
  
  private updateOnlineStatus(): void {
    this.isOnline.set(this.pwaService.isOnline());
  }
}
import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styles: []
})
export class TimerComponent {
  remainingMs = input.required<number>();
  totalSeconds = input.required<number>();

  private totalMs = computed(() => this.totalSeconds() * 1000);
  
  progress = computed(() => (this.remainingMs() / this.totalMs()) * 100);
  
  remainingSeconds = computed(() => Math.floor(this.remainingMs() / 1000));
  
  remainingMilliseconds = computed(() => {
    const ms = this.remainingMs() % 1000;
    return ms.toString().padStart(3, '0');
  });
} 
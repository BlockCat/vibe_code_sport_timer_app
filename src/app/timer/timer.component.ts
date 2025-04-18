import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerDisplayComponent } from './timer-display/timer-display.component';
import { ProgressRingComponent } from './progress-ring/progress-ring.component';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, TimerDisplayComponent, ProgressRingComponent],
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
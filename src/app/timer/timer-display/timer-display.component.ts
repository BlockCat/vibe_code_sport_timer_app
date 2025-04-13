import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-display.component.html',
  styleUrl: './timer-display.component.css'
})
export class TimerDisplayComponent {
  seconds = input.required<number>();
  milliseconds = input.required<string>();
}

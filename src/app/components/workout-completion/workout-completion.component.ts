import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workout-completion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-completion.component.html'
})
export class WorkoutCompletionComponent {
  
  exit = output<void>();
}

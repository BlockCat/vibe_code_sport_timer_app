import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-set-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-set-info.component.html'
})
export class ExerciseSetInfoComponent {
  duration = input<number>(0);
  exerciseCount = input<number>(0);
}

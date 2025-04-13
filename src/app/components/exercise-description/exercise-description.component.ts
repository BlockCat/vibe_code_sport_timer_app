import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-description.component.html'
})
export class ExerciseDescriptionComponent {
  title = input<string>('');
  description = input<string>('');
}

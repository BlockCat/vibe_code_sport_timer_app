import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-header.component.html'
})
export class ExerciseHeaderComponent {
  title = input<string>('');
  description = input<string>('');
}

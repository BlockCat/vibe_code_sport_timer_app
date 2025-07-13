import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center space-x-4 mt-4">
      <slot></slot>
    </div>
  `,
})
export class ExerciseControlsComponent {}

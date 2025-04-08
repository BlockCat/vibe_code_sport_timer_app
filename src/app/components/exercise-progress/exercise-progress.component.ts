import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-6">
      <div class="flex justify-between text-sm text-gray-500 mb-2">
        <span>
          @if (currentExercise() !== null) {
            Exercise {{ currentExercise()! + 1 }} of {{ totalExercises() }}
          } @else {
            Not started
          }
        </span>
        <span>
          @if (currentExercise() !== null) {
            {{ ((currentExercise()! / totalExercises()) * 100) | number:'1.0-0' }}% Complete
          } @else {
            0% Complete
          }
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-indigo-600 h-2.5 rounded-full" 
             [style.width.%]="currentExercise() !== null ? (currentExercise()! / totalExercises()) * 100 : 0">
        </div>
      </div>
    </div>
  `
})
export class ExerciseProgressComponent {
  currentExercise = input<number | null>();
  totalExercises = input.required<number>();
} 
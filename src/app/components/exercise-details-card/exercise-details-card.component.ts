import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-details-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 p-4 rounded-lg mb-4 shadow">
      @if(preparing()) {
      <h2 class="text-xl font-semibold mb-2">Preparing for Exercise</h2>
      } @else {
      <h2 class="text-xl font-semibold mb-2">Current Exercise</h2>
      }

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">Exercise Name</p>
          <p class="font-medium">
            @if (exerciseName()) {
            {{ exerciseName() }}
            } @else { Not started }
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Duration</p>
          <p class="font-medium">
            @if (durationSeconds()) {
            {{ durationSeconds() }} seconds } @else { - }
          </p>
        </div>
        <!-- <div class="col-span-2">
          <p class="text-sm text-gray-500">State</p>
          <p class="font-medium">
            @if (state()) {
              {{ state() }}
            } @else {
              -
            }
          </p>
        </div> -->
      </div>
    </div>
  `,
})
export class ExerciseDetailsCardComponent {
  exerciseName = input<string | null>();
  durationSeconds = input<number | null>();

  preparing = input<boolean>(false);
}

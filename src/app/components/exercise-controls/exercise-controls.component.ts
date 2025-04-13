import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseState } from '../../shared/exercise-state.enum';

@Component({
  selector: 'app-exercise-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center space-x-4 mt-4">
      @if (state()) {
        @if (state() === ExerciseState.Prepare) {
          <button (click)="start.emit()" 
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Start
          </button>
        } @else if (state() === ExerciseState.Active) {
          <button (click)="pause.emit()" 
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Pause
          </button>
        } @else if (state() === ExerciseState.Pause) {
          <button (click)="resume.emit()" 
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Resume
          </button>
        } @else if (state() === ExerciseState.Finished) {
          <button disabled 
                  class="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed">
            Finished
          </button>
        }
      }
    </div>
  `
})
export class ExerciseControlsComponent {
  ExerciseState = ExerciseState;
  state = input<ExerciseState | null>();

  @Output() start = new EventEmitter<void>();
  @Output() pause = new EventEmitter<void>();
  @Output() resume = new EventEmitter<void>();
}
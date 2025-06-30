import { Component, computed, input, output } from '@angular/core';
import {
  WorkoutActiveClickerState,
  WorkoutState,
} from '../../../../services/workout.service';

@Component({
  selector: 'app-sport-clicker',
  imports: [],
  templateUrl: './sport-clicker.component.html',
})
export class SportClickerComponent {
  state = input.required<
    WorkoutState & {
      state: { type: 'active'; exercise: { goal: { repetitions: number } } };
    }
  >();
  currentExerciseSet = computed(() => this.state().exerciseSet);

  finish = output<void>();
}

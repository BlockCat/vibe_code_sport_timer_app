import { Component, computed, input } from '@angular/core';
import {
  WorkoutFinishedState,
  WorkoutState,
} from '../../../../services/workout.service';

@Component({
  selector: 'app-sport-complete',
  imports: [],
  templateUrl: './sport-complete.component.html',
})
export class SportCompleteComponent {
  state = input.required<
    WorkoutState & {
      state: WorkoutFinishedState;
    }
  >();
  currentExerciseSet = computed(() => this.state().exerciseSet);
}

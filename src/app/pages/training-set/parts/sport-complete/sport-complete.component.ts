import { Component, computed, input, output } from '@angular/core';
import {
  WorkoutFinishedState,
  WorkoutState,
} from '../../../../services/workout.service';
import { WorkoutCompletionComponent } from "../../../../components/workout-completion/workout-completion.component";

@Component({
  selector: 'app-sport-complete',
  imports: [WorkoutCompletionComponent],
  templateUrl: './sport-complete.component.html',
})
export class SportCompleteComponent {
  state = input.required<
    WorkoutState & {
      state: WorkoutFinishedState;
    }
  >();
  currentExerciseSet = computed(() => this.state().exerciseSet);

  exit = output<void>();
}

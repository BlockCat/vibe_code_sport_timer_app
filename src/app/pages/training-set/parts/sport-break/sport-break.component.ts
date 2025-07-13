import { Component, computed, input, output } from '@angular/core';
import {
  WorkoutRecoveryState,
  WorkoutState,
} from '../../../../services/workout.service';
import data from '../../data.json';
import { ExerciseDetailsCardComponent } from '../../../../components/exercise-details-card/exercise-details-card.component';
import { TimerComponent } from '../../../../timer/timer.component';
import { ExerciseControlsComponent } from '../../../../components/exercise-controls/exercise-controls.component';
import { ExerciseProgressComponent } from '../../../../components/exercise-progress/exercise-progress.component';
import { ExerciseSetInfoComponent } from '../../../../components/exercise-set-info/exercise-set-info.component';
import { ExerciseHeaderComponent } from '../../../../components/exercise-header/exercise-header.component';
import { ExerciseControlButtonComponent } from "../../../../components/exercise-controls/exercise-control-button/exercise-control-button.component";

@Component({
  selector: 'app-sport-break',
  imports: [
    ExerciseDetailsCardComponent,
    TimerComponent,
    ExerciseControlsComponent,
    ExerciseProgressComponent,
    ExerciseSetInfoComponent,
    ExerciseHeaderComponent,
    ExerciseControlButtonComponent
],
  templateUrl: './sport-break.component.html',
})
export class SportBreakComponent {
  state = input.required<
    WorkoutState & {
      state: WorkoutRecoveryState;
    }
  >();
  currentExercise = computed(() => this.state().exercise!);
  currentExerciseSet = computed(() => this.state().exerciseSet);
  timesMsRemaining = computed(() => this.state().state.remainingMs);

  start = output<void>();
  pause = output<void>();

  title(id: number): string {
    const exercise_id = this.currentExerciseSet().exercises[id].id;
    return data.exercises[exercise_id as keyof typeof data.exercises].title;
  }
}

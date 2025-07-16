import { Component, computed, input, output } from '@angular/core';
import {
  WorkoutPrepareState,
  WorkoutState,
} from '../../../../services/workout.service';
import { ExerciseDetailsCardComponent } from '../../../../components/exercise-details-card/exercise-details-card.component';
import { TimerComponent } from '../../../../timer/timer.component';
import { ExerciseControlsComponent } from '../../../../components/exercise-controls/exercise-controls.component';
import { ExerciseProgressComponent } from '../../../../components/exercise-progress/exercise-progress.component';
import { ExerciseSetInfoComponent } from '../../../../components/exercise-set-info/exercise-set-info.component';
import { ExerciseHeaderComponent } from '../../../../components/exercise-header/exercise-header.component';
import { ExerciseControlButtonComponent } from '../../../../components/exercise-controls/exercise-control-button/exercise-control-button.component';
import { DataService } from '../../../../utils/data.helper';

@Component({
  selector: 'app-sport-prepare',
  imports: [
    ExerciseDetailsCardComponent,
    TimerComponent,
    ExerciseControlsComponent,
    ExerciseProgressComponent,
    ExerciseSetInfoComponent,
    ExerciseHeaderComponent,
    ExerciseControlButtonComponent,
  ],
  templateUrl: './sport-prepare.component.html',
})
export class SportPrepareComponent {
  state = input.required<
    WorkoutState & {
      state: WorkoutPrepareState;
    }
  >();
  currentExercise = computed(() => this.state().exercise!);
  currentExerciseSet = computed(() => this.state().exerciseSet);
  timesMsRemaining = computed(() => this.state().state.remainingMs);

  start = output<void>();

  constructor(private dataService: DataService) {}

  title(id: number): string {
    const exercise_id = this.currentExerciseSet().exercises[id].id;
    return this.dataService.title(exercise_id);
  }
}

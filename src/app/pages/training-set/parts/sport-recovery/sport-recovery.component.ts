import { Component, computed, input, output } from '@angular/core';
import {
  WorkoutRecoveryState,
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
  selector: 'app-sport-recovery',
  imports: [
    ExerciseDetailsCardComponent,
    TimerComponent,
    ExerciseControlsComponent,
    ExerciseProgressComponent,
    ExerciseSetInfoComponent,
    ExerciseHeaderComponent,
    ExerciseControlButtonComponent,
  ],
  templateUrl: './sport-recovery.component.html',
})
export class SportRecoveryComponent {
  state = input.required<
    WorkoutState & {
      state: WorkoutRecoveryState;
    }
  >();
  currentExercise = computed(() => this.state().exercise!);
  currentExerciseSet = computed(() => this.state().exerciseSet);
  timesMsRemaining = computed(() => this.state().state.remainingMs);

  isPaused = computed(() => this.state().state.isPaused);

  start = output<void>();
  pause = output<void>();
  resume = output<void>();

  constructor(private dataService: DataService) {}

  title(id: number): string {
    const exercise_id = this.currentExerciseSet().exercises[id].id;
    return this.dataService.title(exercise_id);
  }

  pauseExercise() {
    this.pause.emit();
  }
  resumeExercise() {
    this.resume.emit();
  }
}

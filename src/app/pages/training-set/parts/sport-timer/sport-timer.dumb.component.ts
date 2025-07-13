import { Component, computed, input, output } from '@angular/core';
import { ExerciseHeaderComponent } from '../../../../components/exercise-header/exercise-header.component';
import { ExerciseDetailsCardComponent } from '../../../../components/exercise-details-card/exercise-details-card.component';
import data from '../../data.json';
import { TimerComponent } from '../../../../timer/timer.component';
import { ExerciseControlsComponent } from '../../../../components/exercise-controls/exercise-controls.component';
import { ExerciseProgressComponent } from '../../../../components/exercise-progress/exercise-progress.component';
import { ExerciseSetInfoComponent } from '../../../../components/exercise-set-info/exercise-set-info.component';
import { ScheduleWorkoutComponent } from '../../../../components/schedule-workout/schedule-workout.component';
import {
  Exercise,
  ExerciseSet,
  WorkoutActiveTimerState,
  WorkoutState,
} from '../../../../services/workout.service';

@Component({
  selector: 'app-sport-timer-dumb',
  imports: [
    ExerciseHeaderComponent,
    ExerciseDetailsCardComponent,
    TimerComponent,
    ExerciseControlsComponent,
    ExerciseProgressComponent,
    ExerciseSetInfoComponent,
  ],
  templateUrl: './sport-timer.dumb.component.html',
})
export class SportTimerDumbComponent {
  state = input.required<
    WorkoutState & {
      exercise: { goal: { duration: number } };
      state: WorkoutActiveTimerState;
    }
  >();
  currentExercise = computed(() => this.state().exercise!);
  currentExerciseSet = computed(() => this.state().exerciseSet);
  timesMsRemaining = computed(() => this.state().state.remainingMs);


  pause = output<void>();
  resume = output<void>();
  finish = output<void>();

  title(id: number): string {
    const exercise_id = this.currentExerciseSet().exercises[id].id;
    return data.exercises[exercise_id as keyof typeof data.exercises].title;
  }

  pauseExercise() {
    this.pause.emit();
  }
  resumeExercise() {
    this.resume.emit();
  }
}

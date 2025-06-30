import { Component, input, output } from '@angular/core';
import { ActiveExercise, ExerciseSet } from '../../training-set.component';
import { ExerciseHeaderComponent } from '../../../../components/exercise-header/exercise-header.component';
import { ExerciseDetailsCardComponent } from '../../../../components/exercise-details-card/exercise-details-card.component';
import data from '../../data.json';
import { TimerComponent } from '../../../../timer/timer.component';
import { ExerciseControlsComponent } from '../../../../components/exercise-controls/exercise-controls.component';
import { ExerciseProgressComponent } from '../../../../components/exercise-progress/exercise-progress.component';
import { ExerciseSetInfoComponent } from '../../../../components/exercise-set-info/exercise-set-info.component';
import { ScheduleWorkoutComponent } from '../../../../components/schedule-workout/schedule-workout.component';

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
  currentExerciseSet = input.required<ExerciseSet>();
  currentExercise = input.required<ActiveExercise>();
  timesMsRemaining = input.required<number>();

  onStartExercise = output<number>();
  onPauseExercise = output<void>();
  onResumeExercise = output<void>();

  title(id: number): string {
    const exercise_id = this.currentExerciseSet().exercises[id].id;
    return data.exercises[exercise_id as keyof typeof data.exercises].title;
  }

  startExercise(index: number) {
    this.onStartExercise.emit(index);
  }
  pauseExercise() {
    this.onPauseExercise.emit();
  }
  resumeExercise() {
    this.onResumeExercise.emit();
  }
}

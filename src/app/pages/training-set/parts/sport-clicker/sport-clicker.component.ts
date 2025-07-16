import { Component, computed, input, output } from '@angular/core';
import {
  WorkoutActiveClickerState,
  WorkoutState,
} from '../../../../services/workout.service';
import { ExerciseHeaderComponent } from '../../../../components/exercise-header/exercise-header.component';
import { ExerciseDetailsCardComponent } from '../../../../components/exercise-details-card/exercise-details-card.component';
import { ExerciseControlsComponent } from '../../../../components/exercise-controls/exercise-controls.component';
import { ExerciseControlButtonComponent } from '../../../../components/exercise-controls/exercise-control-button/exercise-control-button.component';
import { ExerciseProgressComponent } from '../../../../components/exercise-progress/exercise-progress.component';
import { ExerciseSetInfoComponent } from '../../../../components/exercise-set-info/exercise-set-info.component';
import { DataService } from '../../../../utils/data.helper';

@Component({
  selector: 'app-sport-clicker',
  imports: [
    ExerciseHeaderComponent,
    ExerciseDetailsCardComponent,
    ExerciseControlsComponent,
    ExerciseControlButtonComponent,
    ExerciseProgressComponent,
    ExerciseSetInfoComponent,
  ],
  templateUrl: './sport-clicker.component.html',
})
export class SportClickerComponent {
  state = input.required<
    WorkoutState & {
      state: { type: 'active'; exercise: { goal: { repetitions: number } } };
    }
  >();

  currentExercise = computed(() => this.state().exercise!);
  currentExerciseSet = computed(() => this.state().exerciseSet);

  finish = output<void>();

  constructor(private dataService: DataService) {}

  title(id: number): string {
    const exercise_id = this.currentExerciseSet().exercises[id].id;
    return this.dataService.title(exercise_id);
  }

  onFinish() {
    console.log("Finishing exercise clicker");
    this.finish.emit();
  }
}

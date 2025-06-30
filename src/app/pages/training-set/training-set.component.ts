import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  signal,
  inject,
  Signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import data from './data.json';
import { SportTimerComponent } from './parts/sport-timer/sport-timer.component';
import { Exercise, ExerciseSet, WorkoutService, WorkoutState } from '../../services/workout.service';

@Component({
  selector: 'app-training-set',
  standalone: true,
  imports: [CommonModule, SportTimerComponent],
  templateUrl: './training-set.component.html',
})
export class TrainingSetComponent implements OnDestroy {
  
  
  protected currentExercise: Signal<Exercise | undefined>;
  protected currentExerciseSet: Signal<ExerciseSet | undefined>;
  protected workoutState: Signal<WorkoutState | undefined>;

  constructor(route: ActivatedRoute, private workoutService: WorkoutService) {
    route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        const exerciseSet = this.loadExerciseSetById(id);
        if (!exerciseSet) {
          console.error(`Exercise set with id ${id} not found`);
          return;
        }
        this.workoutService.startWorkout(exerciseSet);
      }
    });

    this.currentExercise = workoutService.currentExercise;
    this.currentExerciseSet = workoutService.currentExerciseSet;
    this.workoutState = workoutService.workoutState;
  }  
  ngOnDestroy(): void {
    this.workoutService.cancelWorkout();
  }


  onExerciseComplete() {
    throw new Error('Method not implemented.');
  }


  private loadExerciseSetById(id: string): ExerciseSet | null {
    const exerciseSet = data.workouts[id as keyof typeof data.workouts] as ExerciseSet;
    if (!exerciseSet) {
      console.error(`Exercise set with id ${id} not found`);
      return null;
    }

    return exerciseSet;
  }
}

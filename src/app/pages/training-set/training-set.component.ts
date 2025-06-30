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
import {
  Exercise,
  ExerciseSet,
  WorkoutActiveTimerState,
  WorkoutService,
  WorkoutState,
} from '../../services/workout.service';
import { SportTimerDumbComponent } from './parts/sport-timer/sport-timer.dumb.component';
import { SportPrepareComponent } from './parts/sport-prepare/sport-prepare.component';
import { SportBreakComponent } from './parts/sport-break/sport-break.component';
import { SportClickerComponent } from './parts/sport-clicker/sport-clicker.component';
import { SportCompleteComponent } from './parts/sport-complete/sport-complete.component';

@Component({
  selector: 'app-training-set',
  standalone: true,
  imports: [
    CommonModule,
    SportTimerDumbComponent,
    SportPrepareComponent,
    SportBreakComponent,
    SportClickerComponent,
    SportCompleteComponent,
  ],
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
    const exerciseSet = data.workouts[
      id as keyof typeof data.workouts
    ] as ExerciseSet;
    if (!exerciseSet) {
      console.error(`Exercise set with id ${id} not found`);
      return null;
    }

    return exerciseSet;
  }

  asActivestate(state: WorkoutState): state is WorkoutState & {
    exercise: { goal: { duration: number } };
    state: WorkoutActiveTimerState;
  } {
    return state.state && state.state.type === 'active';
  }

  asPrepareState(state: WorkoutState): state is WorkoutState & {
    state: { type: 'prepare' };
  } {
    return state.state && state.state.type === 'prepare';
  }

  asRecoveryState(state: WorkoutState): state is WorkoutState & {
    state: { type: 'recovery' };
  } {
    return state.state && state.state.type === 'recovery';
  }

  asFinishedState(state: WorkoutState): state is WorkoutState & {
    state: { type: 'finished' };
  } {
    return state.state && state.state.type === 'finished';
  }

  asActiveClickState(state: WorkoutState): state is WorkoutState & {
    state: { type: 'active'; exercise: { goal: { repetitions: number } } };
  } {
    return (
      state.state &&
      state.state.type === 'active' &&
      !!state.exercise &&
      'repetitions' in state.exercise?.goal
    );
  }

  startExercise() {
    // this.workoutService.startActiveExercise(arg0);
  }
  pauseExercise() {
    // this.workoutService.pause();
  }
  resumeExercise() {
    // this.workoutService.resume();
  }
  finishExercise() {
    this.workoutService.onTimerComplete();
  }
}

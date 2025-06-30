import { computed, effect, Injectable, signal } from '@angular/core';
import { Stopwatch, TimerService } from '../utils/timer.service';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly PREP_TIME_SECONDS = 7;

  workoutState = signal<WorkoutState | undefined>(undefined);
  stopwatch: Stopwatch;

  currentExercise = computed(() => this.workoutState()?.exercise);
  currentExerciseSet = computed(() => this.workoutState()?.exerciseSet);
  totalExercises = computed(
    () => this.workoutState()?.exerciseSet.exercises.length || 0
  );

  constructor(timerService: TimerService, private audioService: AudioService) {
    this.stopwatch = timerService
      .begin()
      .withOnTick((rms) => {
        this.workoutState.update((state) => {
          if (state === undefined) {
            return state;
          }
          if ('remainingMs' in state.state) {
            return {
              ...state,
              state: {
                ...state.state,
                remainingMs: rms,
              },
            };
          }
          return state;
        });
        console.log('Timer tick:', rms);
      })
      .withOnSecondTick((rms) => {
        console.log('Timer second tick:', rms);
        audioService.playCountdown(rms);

        const exercise = this.currentExercise();
        if (exercise && 'duration' in exercise.goal) {
          if (
            exercise?.goal.duration > 20 &&
            rms === Math.floor(exercise.goal.duration / 2)
          ) {
            this.audioService.playHalfway();
          }
          if (
            exercise.goal.duration > 20 &&
            rms === exercise.goal.duration * 0.8
          ) {
            this.audioService.playRandomHint(exercise.id);
          }
        }
      })
      .withOnComplete(() => {
        this.onTimerComplete();
      });
  }

  startWorkout(exerciseSet: ExerciseSet) {
    const exercise = this.createExerciseFromSet(exerciseSet, 0);

    if ('duration' in exercise.goal) {
      this.audioService.playExerciseIntro(
        exercise.id,
        exercise.goal.duration,
        false
      );
    }
    if ('repetitions' in exercise.goal) {
      this.audioService.playExerciseIntro(
        exercise.id,
        exercise.goal.repetitions,
        true
      );
    }

    this.workoutState.set({
      exercise,
      exerciseSet,
      state: {
        type: 'prepare',
        remainingMs: this.PREP_TIME_SECONDS * 1000,
      },
    });
    this.stopwatch.start(this.PREP_TIME_SECONDS * 1000);
  }

  startActiveExercise(index: number): boolean {
    const currentState = this.workoutState();
    if (!currentState) {
      return false;
    }

    if (index < 0 || index >= currentState.exerciseSet.exercises.length) {
      return false;
    }

    const exercise = currentState.exerciseSet.exercises[index];
    this.audioService.playCountdownStart();

    if ('repetitions' in exercise.goal) {
      this.workoutState.set({
        ...currentState,
        exercise: this.createExerciseFromSet(currentState.exerciseSet, index),
        state: {
          type: 'active',
          repetitions: exercise.goal.repetitions,
        },
      });
      this.stopwatch.stop();
    } else if ('duration' in exercise.goal) {
      this.workoutState.set({
        ...currentState,
        exercise: this.createExerciseFromSet(currentState.exerciseSet, index),
        state: {
          type: 'active',
          remainingMs: exercise.goal.duration * 1000,
        },
      });
      this.stopwatch.start(exercise.goal.duration * 1000);
    } else {
      return false;
    }

    return true;
  }

  startRecovery(index: number): boolean {
    const currentState = this.workoutState();
    if (!currentState) {
      return false;
    }

    if (index < 0 || index >= currentState.exerciseSet.exercises.length) {
      return false;
    }

    const exercise = currentState.exerciseSet.exercises[index];

    if ('duration' in exercise.goal) {
      this.audioService.playExerciseIntro(
        exercise.id,
        exercise.goal.duration,
        false
      );
    }
    if ('repetitions' in exercise.goal) {
      this.audioService.playExerciseIntro(
        exercise.id,
        exercise.goal.repetitions,
        true
      );
    }

    this.workoutState.set({
      ...currentState,
      exercise: this.createExerciseFromSet(currentState.exerciseSet, index),
      state: {
        type: 'recovery',
        remainingMs: exercise.breakSeconds * 1000,
      },
    });
    this.stopwatch.start(exercise.breakSeconds * 1000);
    return true;
  }

  nextExerciseIndex(): number | 'completed' {
    const currentState = this.workoutState();
    if (!currentState) {
      return -1;
    }

    const currentExercise = currentState.exercise;
    if (!currentExercise) {
      return 0;
    }

    const nextIndex = currentExercise.index + 1;
    if (nextIndex < currentState.exerciseSet.exercises.length) {
      return nextIndex;
    } else {
      return 'completed';
    }
  }

  cancelWorkout() {
    this.workoutState.set(undefined);
  }

  onTimerComplete() {
    const currentState = this.workoutState();
    if (!currentState) {
      return;
    }

    if (currentState.state.type === 'prepare') {
      this.startActiveExercise(0);
    } else if (currentState.state.type === 'active') {
      const nextIndex = this.nextExerciseIndex();
      console.log('Next exercise index:', nextIndex);
      if (nextIndex === 'completed') {
        this.workoutState.set({
          ...currentState,
          exercise: undefined,
          state: { type: 'finished' },
        });
      } else {
        this.startRecovery(nextIndex);
      }
    } else if (currentState.state.type === 'recovery') {
      this.startActiveExercise(currentState.exercise!.index as number);
    }
  }

  createExerciseFromSet(exerciseSet: ExerciseSet, index: number): Exercise {
    if (index < 0 || index >= exerciseSet.exercises.length) {
      throw new Error('Index out of bounds');
    }
    const exercise = exerciseSet.exercises[index];
    return {
      ...exercise,
      index: index,
      id: exercise.id,
    };
  }
}

export interface WorkoutState {
  exercise?: Exercise;
  exerciseSet: ExerciseSet;
  state: WorkoutStateType;
}

export type WorkoutStateType =
  | WorkoutPrepareState
  | WorkoutRecoveryState
  | WorkoutActiveTimerState
  | WorkoutActiveClickerState
  | WorkoutFinishedState;

export interface TimedState {
  remainingMs: number;
}
export interface WorkoutPrepareState extends TimedState {
  type: 'prepare';
}
export interface WorkoutRecoveryState extends TimedState {
  type: 'recovery';
}
export interface WorkoutActiveTimerState extends TimedState {
  type: 'active';
}
export interface WorkoutActiveClickerState {
  type: 'active';
  repetitions: number;
}
export interface WorkoutFinishedState {
  type: 'finished';
}

export interface ExerciseSet {
  title: string;
  description: string;
  duration: number;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  index: number;
  goal: { duration: number } | { repetitions: number };
  breakSeconds: number;
}

// export enum ExerciseState {
//   Prepare = 'prepare',
//   Active = 'active',
//   Recovery = 'recovery',
//   Pause = 'pause',
//   Finished = 'finished'
// }

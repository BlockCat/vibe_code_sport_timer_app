import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly PREP_TIME_SECONDS = 7;

  workoutState = signal<WorkoutState | undefined>(undefined);

  currentExercise = computed(() => this.workoutState()?.exercise);
  currentExerciseSet = computed(() => this.workoutState()?.exerciseSet);
  totalExercises = computed(
    () => this.workoutState()?.exerciseSet.exercises.length || 0
  );

  constructor() {}

  startWorkout(exerciseSet: ExerciseSet) {
    this.workoutState.set({
      exercise: undefined,
      exerciseSet: exerciseSet,
      state: {
        type: 'prepare',
        remainingMs: this.PREP_TIME_SECONDS * 1000,
      },
    });
  }
  startExerciseRecovery(): boolean {
    const currentState = this.workoutState();
    if (!currentState) {
      return false;
    }

    const exercise = currentState.exercise;
    if (!exercise) {
      return false;
    }

    this.workoutState.set({
      ...currentState,
      state: {
        type: 'recovery',
        remainingMs: exercise.breakSeconds * 1000,
      },
    });
    return true;
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

    if ('repetitions' in exercise.goal) {
      this.workoutState.set({
        ...currentState,
        state: {
          type: 'active',
          repetitions: exercise.goal.repetitions,
        },
      });
    } else if ('duration' in exercise.goal) {
      this.workoutState.set({
        ...currentState,
        state: {
          type: 'active',
          remainingMs: exercise.goal.duration * 1000,
        },
      });
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

    this.workoutState.set({
      ...currentState,
      state: {
        type: 'recovery',
        remainingMs: exercise.breakSeconds * 1000,
      },
    });
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

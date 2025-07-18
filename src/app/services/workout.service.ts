import { computed, effect, Injectable, signal } from '@angular/core';
import { Stopwatch, TimerService } from '../utils/timer.service';
import { AudioService } from './audio.service';
import { WorkoutStreakService } from './workout-streak.service';

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

  constructor(
    timerService: TimerService,
    private audioService: AudioService,
    private workoutStreakService: WorkoutStreakService
  ) {
    this.stopwatch = timerService
      .begin()
      .withOnTick((remainingMs) => {
        this.workoutState.update((state) => {
          if (!state || !('remainingMs' in state.state)) {
            return state;
          }
          return {
            ...state,
            state: {
              ...state.state,
              remainingMs,
            },
          };
        });
      })
      .withOnSecondTick((secondsRemaining) => {
        const exercise = this.currentExercise();
        if (!exercise || !('duration' in exercise.goal)) {
          return;
        }

        // Countdown audio
        if (secondsRemaining <= 3 && secondsRemaining > 0) {
          this.audioService.playCountdown(secondsRemaining);
        }

        // Halfway audio
        const halfwayPoint = Math.floor(exercise.goal.duration / 2);
        if (exercise.goal.duration > 20 && secondsRemaining === halfwayPoint) {
          this.audioService.playHalfway();
        }

        // Hint audio
        const hintPoint = Math.floor(exercise.goal.duration * 0.8);
        if (exercise.goal.duration > 20 && secondsRemaining === hintPoint) {
          this.audioService.playRandomHint(exercise.id);
        }
      })
      .withOnComplete(() => {
        this.finishExerciseAndStartRecovery();
      });
  }
  private handleError(error: unknown, context: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Workout Service Error [${context}]:`, errorMessage);
    // Reset to safe state
    this.cancelWorkout();
  }

  startWorkout(exerciseSet: ExerciseSet, workoutId?: string): void {
    try {
      if (!exerciseSet?.exercises?.length) {
        throw new Error('Invalid exercise set: no exercises found');
      }

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
        workoutId,
        exercise,
        exerciseSet,
        state: {
          type: 'prepare',
          remainingMs: this.PREP_TIME_SECONDS * 1000,
        },
      });
      this.stopwatch.start(this.PREP_TIME_SECONDS * 1000);
    } catch (error) {
      this.handleError(error, 'startWorkout');
    }
  }

  startActiveExercise(index: number): boolean {
    try {
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
    } catch (error) {
      this.handleError(error, 'startActiveExercise');
      return false;
    }
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

  finishExerciseAndStartRecovery(): void {
    try {
      const currentState = this.workoutState();
      if (!currentState) {
        console.warn('Timer completed but no workout state available');
        return;
      }
      switch (currentState.state.type) {
        case 'prepare':
          this.startActiveExercise(0);
          break;

        case 'active':
          const nextIndex = this.nextExerciseIndex();
          if (nextIndex === 'completed') {
            // Record workout completion for streak tracking
            if (currentState.workoutId) {
              this.workoutStreakService.recordWorkoutCompletion(
                currentState.workoutId
              );
            }

            this.workoutState.set({
              ...currentState,
              exercise: undefined,
              state: { type: 'finished' },
            });
          } else if (typeof nextIndex === 'number') {
            this.startRecovery(nextIndex);
          }
          break;

        case 'recovery':
          if (currentState.exercise) {
            this.startActiveExercise(currentState.exercise.index);
          }
          break;

        default:
          console.error('Invalid state transition:', currentState.state.type);
      }
    } catch (error) {
      this.handleError(error, 'onTimerComplete');
    }
  }

  pause(): void {
    try {
      const currentState = this.workoutState();
      if (!currentState || !this.canPause(currentState.state)) {
        return;
      }

      this.stopwatch.pause();
      this.workoutState.update((state) => {
        if (!state || !this.canPause(state.state)) return state;
        return {
          ...state,
          state: {
            ...state.state,
            isPaused: true,
          },
        };
      });
    } catch (error) {
      this.handleError(error, 'pause');
    }
  }

  resume(): void {
    try {
      const currentState = this.workoutState();
      if (!currentState || !this.canPause(currentState.state)) {
        return;
      }

      this.stopwatch.resume();
      this.workoutState.update((state) => {
        if (!state || !this.canPause(state.state)) return state;
        return {
          ...state,
          state: {
            ...state.state,
            isPaused: false,
          },
        };
      });
    } catch (error) {
      this.handleError(error, 'resume');
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

  private canPause(stateType: WorkoutStateType): boolean {
    return ['active', 'recovery'].includes(stateType.type);
  }
}

export interface WorkoutState {
  workoutId?: string;
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
  isPaused?: boolean;
}
export interface WorkoutActiveTimerState extends TimedState {
  type: 'active';
  isPaused?: boolean;
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

import { Component, OnInit, OnDestroy, Output, EventEmitter, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TimerComponent } from '../../timer/timer.component';
import { ExerciseDetailsCardComponent } from '../../components/exercise-details-card/exercise-details-card.component';
import { ExerciseControlsComponent } from '../../components/exercise-controls/exercise-controls.component';
import { ExerciseProgressComponent } from '../../components/exercise-progress/exercise-progress.component';
import { ExerciseHeaderComponent } from '../../components/exercise-header/exercise-header.component';
import { ExerciseSetInfoComponent } from '../../components/exercise-set-info/exercise-set-info.component';
import { WorkoutCompletionComponent } from '../../components/workout-completion/workout-completion.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { TimerService } from '../../utils/timer.service';
import { AudioService } from '../../services/audio.service';
import data from "./data.json";

export interface ActiveExercise {
  durationSeconds: number;
  index: number;
  state: ExerciseState;
  remainingMs: number;
}

export interface ExerciseSet {
  title: string;
  description: string;
  duration: number;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  activeSeconds: number;
  breakSeconds: number;
}

export enum ExerciseState {
  Prepare = 'prepare',
  Active = 'active',
  Recovery = 'recovery',
  Pause = 'pause',
  Finished = 'finished'
}

@Component({
  selector: 'app-training-set',
  standalone: true,
  imports: [
    CommonModule,
    TimerComponent,
    ExerciseDetailsCardComponent,
    ExerciseControlsComponent,
    ExerciseProgressComponent,
    ExerciseHeaderComponent,
    ExerciseSetInfoComponent,
    WorkoutCompletionComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './training-set.component.html'
})
export class TrainingSetComponent implements OnInit, OnDestroy {

  preparationStarted = output<number>();
  exerciseStarted = output<number>();
  exerciseEnded = output<number>();
  exerciseSecondsLeft = output<{ seconds: number, totalSeconds: number, exerciseIndex: number }>();
  exercisePaused = output<number>();
  exerciseResumed = output<number>();

  ExerciseState = ExerciseState;
  exercise: ActiveExercise | null = null;
  totalExercises = 5;
  currentExerciseSet: ExerciseSet | null = null;

  private readonly PREP_TIME_SECONDS = 7;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private timerService: TimerService,
    private audioService: AudioService
  ) {
    this.preparationStarted.subscribe((index) => {
      if (this.currentExerciseSet) {
        let exercise = this.currentExerciseSet.exercises[index];
        this.audioService.playExerciseIntro(exercise.id, exercise.activeSeconds);
      }
    });
    
    this.exerciseStarted.subscribe(() => {
      this.audioService.playCountdownStart();
    });
    
    this.exerciseSecondsLeft.subscribe((times) => {
      if (!this.currentExerciseSet) return;
      
      let exercise = this.currentExerciseSet.exercises[times.exerciseIndex];

      if (times.seconds === 3 || times.seconds === 2 || times.seconds === 1) {
        this.audioService.playCountdown(times.seconds);
      } else if (times.seconds === Math.ceil(times.totalSeconds / 2) && times.totalSeconds > 20) {
        this.audioService.playHalfway();
      } else if (times.seconds === Math.ceil(times.totalSeconds * 0.8) && times.totalSeconds > 15) {
        this.audioService.playRandomHint(exercise.id);
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const exerciseSet = this.loadExerciseSetById(params['id']);
      if (exerciseSet) {
        this.currentExerciseSet = exerciseSet;
        this.totalExercises = exerciseSet.exercises.length;
        this.startPreparation(0, true);
      }
    });
  }

  ngOnDestroy(): void {
    this.timerService.stop();
  }

  private startPreparation(index: number, first: boolean): void {
    if (index >= this.totalExercises) {
      this.exercise = { ...this.exercise!, state: ExerciseState.Finished };
      return;
    }

    this.preparationStarted.emit(index);
    this.exercise = this.createActiveExercisebyId(index, ExerciseState.Prepare);

    const startTime = first ? this.PREP_TIME_SECONDS : this.currentExerciseSet!.exercises[index - 1].breakSeconds;

    this.timerService.start(
      startTime * 1000,
      (remainingMs) => {
        if (this.exercise) {
          const oldRemaining = Math.ceil(this.exercise.remainingMs / 1000);
          this.exercise.remainingMs = remainingMs;
          const secondsLeft = Math.ceil(remainingMs / 1000);

          if (oldRemaining != secondsLeft) {
            this.exerciseSecondsLeft.emit({ 
              seconds: secondsLeft, 
              totalSeconds: this.exercise.durationSeconds, 
              exerciseIndex: this.exercise.index 
            });
          }
        }
      },
      () => this.startExercise(index)
    );
  }

  startExercise(index: number): void {
    this.exercise = this.createActiveExercisebyId(index, ExerciseState.Active);
    this.exerciseStarted.emit(this.exercise.index);

    this.timerService.start(
      this.exercise.durationSeconds * 1000,
      (remainingMs) => {
        if (this.exercise) {
          const oldRemaining = Math.ceil(this.exercise.remainingMs / 1000);
          this.exercise.remainingMs = remainingMs;
          const secondsLeft = Math.ceil(remainingMs / 1000);

          if (oldRemaining != secondsLeft) {
            this.exerciseSecondsLeft.emit({ 
              seconds: secondsLeft, 
              totalSeconds: this.exercise.durationSeconds, 
              exerciseIndex: this.exercise.index 
            });
          }
        }
      },
      () => {
        this.exerciseEnded.emit(this.exercise!.index);
        this.startPreparation(index + 1, false);
      }
    );
  }

  pauseExercise(): void {
    if (!this.exercise) return;

    this.exercise.state = ExerciseState.Pause;
    this.exercisePaused.emit(this.exercise.index);
    this.timerService.pause();
  }

  resumeExercise(): void {
    if (!this.exercise) return;

    this.exercise.state = ExerciseState.Active;
    this.exerciseResumed.emit(this.exercise.index);
    this.timerService.resume();
  }

  restartWorkout(): void {
    if (!this.currentExerciseSet) return;
    this.startPreparation(0, true);
  }

  exitWorkout(): void {
    this.router.navigate(['/']);
  }

  title(id: number): string {
    const exercise_id = this.currentExerciseSet?.exercises[id].id;
    return data.exercises[exercise_id as keyof typeof data.exercises].title;
  }

  description(id: number): string {
    const exercise_id = this.currentExerciseSet?.exercises[id].id;
    return data.exercises[exercise_id as keyof typeof data.exercises].description;
  }

  private createActiveExercisebyId(index: number, state: ExerciseState): ActiveExercise {
    if (!this.currentExerciseSet) {
      throw new Error("No active exercise set");
    }
    let ex = this.currentExerciseSet.exercises[index];
    return {
      index,
      durationSeconds: ex.activeSeconds,
      remainingMs: ex.activeSeconds * 1000,
      state
    };
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
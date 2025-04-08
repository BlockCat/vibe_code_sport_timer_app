import { Component, OnInit, OnDestroy, Output, EventEmitter, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TimerComponent } from '../../timer/timer.component';
import { ExerciseDetailsCardComponent } from '../../components/exercise-details-card/exercise-details-card.component';
import { ExerciseControlsComponent } from '../../components/exercise-controls/exercise-controls.component';
import { ExerciseProgressComponent } from '../../components/exercise-progress/exercise-progress.component';
import { TimerService } from '../../utils/timer.service';
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
    ExerciseProgressComponent
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
  private readonly HALFWAY_THRESHOLD = 0.5;

  constructor(
    private route: ActivatedRoute,
    private timerService: TimerService
  ) {

    this.preparationStarted.subscribe((index) => {
      let exercise = this.currentExerciseSet!.exercises[index];


      const audio = new Audio(`/voices/${exercise.id}_${exercise.activeSeconds}.mp3`);
      audio.playbackRate = 1.1;
      audio.play();
    });
    this.exerciseStarted.subscribe((index) => {
      let exercise = this.currentExerciseSet!.exercises[index];


      const audio = new Audio(`/voices/countdown_start.mp3`);
      audio.playbackRate = 1.1;
      audio.play();
    });
    this.exerciseSecondsLeft.subscribe((times) => {
      let exercise = this.currentExerciseSet!.exercises[times.exerciseIndex];

      if (times.seconds === 3) {
        const audio = new Audio(`/voices/countdown_3.mp3`);
        audio.playbackRate = 1.1;
        audio.play();
      } else if (times.seconds === 2) {
        const audio = new Audio(`/voices/countdown_2.mp3`);
        audio.playbackRate = 1.1;
        audio.play();
      } else if (times.seconds === 1) {
        const audio = new Audio(`/voices/countdown_1.mp3`);
        audio.playbackRate = 1.1;
        audio.play();
      } else if (times.seconds === Math.ceil(times.totalSeconds / 2) && times.totalSeconds > 20) {
        const audio = new Audio(`/voices/halfway.mp3`);
        audio.playbackRate = 1.1;
        audio.play();
      } else if (times.seconds === Math.ceil(times.totalSeconds * 0.8) && times.totalSeconds > 15) {
        let hints = data.exercises[exercise.id as keyof typeof data.exercises].hints;
        let random = Math.floor(Math.random() * hints.length);        

        let hint = hints[random].id;
        const audio = new Audio(`/voices/${hint}.mp3`);
        audio.playbackRate = 1.1;
        audio.play();
      }

    })
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

    this.preparationStarted.emit(index);
    this.exercise = this.createActiveExercisebyId(0, ExerciseState.Prepare);

    const startTime = first ? 7 : this.currentExerciseSet!.exercises[index - 1].breakSeconds;


    this.timerService.start(
      startTime * 1000,
      (remainingMs) => {
        if (this.exercise) {
          const oldRemaining = Math.ceil(this.exercise.remainingMs / 1000);
          this.exercise.remainingMs = remainingMs;
          const secondsLeft = Math.ceil(remainingMs / 1000);

          if (oldRemaining != secondsLeft) {
            // Emit seconds left
            this.exerciseSecondsLeft.emit({ seconds: secondsLeft, totalSeconds: this.exercise.durationSeconds, exerciseIndex: this.exercise.index });
          }
        }
      },
      () => this.startExercise(0)
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
            // Emit seconds left
            this.exerciseSecondsLeft.emit({ seconds: secondsLeft, totalSeconds: this.exercise.durationSeconds, exerciseIndex: this.exercise.index });
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
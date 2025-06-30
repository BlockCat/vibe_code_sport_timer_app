import { Component, input, OnDestroy, output, signal } from '@angular/core';
import { SportTimerDumbComponent } from './sport-timer.dumb.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TimerService } from '../../../../utils/timer.service';
import { AudioService } from '../../../../services/audio.service';
import { ActiveExercise, ExerciseSet } from '../../training-set.component';
import { ExerciseState } from '../../../../shared/exercise-state.enum';

@Component({
  selector: 'app-sport-timer',
  imports: [SportTimerDumbComponent],
  template: `<app-sport-timer-dumb
    [currentExerciseSet]="currentExerciseSet()"
    [currentExercise]="currentExercise()"
    [timesMsRemaining]="timesMsRemaining()"
    (onStartExercise)="startExercise($event)"
    (onPauseExercise)="pauseExercise()"
    (onResumeExercise)="resumeExercise()"
  />`,
})
export class SportTimerComponent implements OnDestroy {
  currentExercise = input.required<ActiveExercise>();
  currentExerciseSet = input.required<ExerciseSet>();

  exerciseComplete = output<void>();

  exerciseState = signal(ExerciseState.Prepare);

  timesMsRemaining = signal(0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private timerService: TimerService,
    private audioService: AudioService
  ) {}

  startExercise(index: number) {
    this.exerciseState.set(ExerciseState.Active);

    this.timerService.start(
      this.currentExercise().durationSeconds * 1000,
      (remainingMs: number) => {
        const oldRemaining = Math.ceil(this.timesMsRemaining() / 1000);
        const secondsLeft = Math.ceil(remainingMs / 1000);
        this.timesMsRemaining.set(remainingMs);
        if (secondsLeft !== oldRemaining) {
          this.onSecondTick(secondsLeft);
        }
      },
      () => {
        this.exerciseComplete.emit();
      }
    );
  }
  pauseExercise() {
    this.exerciseState.set(ExerciseState.Pause);
    this.timerService.pause();
  }
  resumeExercise() {
    this.exerciseState.set(ExerciseState.Active);
    this.timerService.resume();
  }

  ngOnDestroy(): void {
    this.timerService.stop();
  }

  private onSecondTick(secondsRemaining: number) {
    const totalSeconds = this.currentExercise().durationSeconds;
    if (
      secondsRemaining === 3 ||
      secondsRemaining === 2 ||
      secondsRemaining === 1
    ) {
      this.audioService.playCountdown(secondsRemaining);
    } else if (
      secondsRemaining === Math.ceil(totalSeconds / 2) &&
      totalSeconds > 20
    ) {
      this.audioService.playHalfway();
    } else if (
      secondsRemaining === Math.ceil(totalSeconds * 0.8) &&
      totalSeconds > 15
    ) {
      const id =
        this.currentExerciseSet().exercises[this.currentExercise().index].id;
      this.audioService.playRandomHint(id);
    }
  }
}

import {
  computed,
  effect,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

export interface TimerState {
  remainingMs: number;
  isRunning: boolean;
  totalMs: number;
}

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private state: WritableSignal<TimerState> = signal({
    remainingMs: 0,
    isRunning: false,
    totalMs: 0,
  });

  getState() {
    return this.state.asReadonly();
  }

  begin(): Stopwatch {
    return new Stopwatch();
  }
}

export class Stopwatch {
  private _remainingMs: WritableSignal<number>;
  private _completed: WritableSignal<boolean> = signal(false);

  remainingMs: Signal<number>;
  completed: Signal<boolean>;
  remainingSeconds: Signal<number> = computed(() => {
    return Math.ceil(this._remainingMs() / 1000);
  });

  tickEffect = effect(() => {
    this.onTick(this.remainingMs());
  });
  secondTickEffect = effect(() => {
    this.onSecondTick(this.remainingSeconds());
  });
  completedEffect = effect(() => {
    if (this.completed() == true) {
      this.onComplete();
    }
  });

  onTick: (remainingMs: number) => void = () => {};
  onSecondTick: (remainingMs: number) => void = () => {};
  onComplete: () => void = () => {};

  get isRunning(): boolean {
    return this.timer !== null;
  }

  private timer: any = null;

  constructor() {
    this._remainingMs = signal(0);
    this.remainingMs = this._remainingMs.asReadonly();
    this.completed = this._completed.asReadonly();
  }

  start(remainingNs: number): Stopwatch {
    this._remainingMs.set(remainingNs);
    this._completed.set(false);
    if (this.isRunning) {
      this.stop();
    }

    console.debug('Starting stopwatch with', remainingNs, 'ms');

    this.timer = setInterval(() => {
      if (this._remainingMs() <= 0) {
        this._completed.set(true);
        this.onTick(0);        
        this.stop();
        this.onComplete();
        return;
      }

      this._remainingMs.update((a) => a - 100);
    }, 100);
    return this;
  }

  withOnTick(onTick: (remainingMs: number) => void): Stopwatch {
    this.onTick = onTick;

    return this;
  }
  withOnSecondTick(
    onSecondTick: (remainingSeconds: number) => void
  ): Stopwatch {
    this.onSecondTick = onSecondTick;
    return this;
  }
  withOnComplete(onComplete: () => void): Stopwatch {
    this.onComplete = onComplete;
    return this;
  }

  pause() {
    this.stop();
  }

  resume() {
    if (this.isRunning) {
      return;
    }
    this.start(this._remainingMs());
  }

  stop() {
    if (this.isRunning) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

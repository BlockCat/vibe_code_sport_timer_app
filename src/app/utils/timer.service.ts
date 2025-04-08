import { Injectable, signal, WritableSignal } from '@angular/core';

export interface TimerState {
  remainingMs: number;
  isRunning: boolean;
  totalMs: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timer: any = null;
  private state: WritableSignal<TimerState> = signal({
    remainingMs: 0,
    isRunning: false,
    totalMs: 0
  });

  private onTick: (remainingMs:number) => void = () => {};
  private onComplete: () => void = () => {};

  getState() {
    return this.state.asReadonly();
  }

  start(totalMs: number, onTick: (remainingMs: number) => void, onComplete: () => void): void {    
    this.stop();
    this.onTick = onTick;
    this.onComplete = onComplete;
    
    this.state.set({
      remainingMs: totalMs,
      isRunning: true,
      totalMs
    });

    this.timer = setInterval(() => {
      const currentState = this.state();
      const newRemainingMs = currentState.remainingMs - 100;
      
      if (newRemainingMs <= 0) {
        this.stop();
        onComplete();
        return;
      }

      this.state.set({
        ...currentState,
        remainingMs: newRemainingMs
      });
      
      onTick(newRemainingMs);
    }, 100);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.state.set({
      ...this.state(),
      isRunning: false
    });
  }

  pause(): void {
    this.stop();
    
  }

  resume(): void {
    if (this.state().isRunning) return;

    this.start(this.state().remainingMs, this.onTick, this.onComplete);
  }

  reset(totalSeconds: number): void {
    this.stop();
    this.state.set({
      remainingMs: totalSeconds * 1000,
      isRunning: false,
      totalMs: totalSeconds * 1000
    });
  }
} 
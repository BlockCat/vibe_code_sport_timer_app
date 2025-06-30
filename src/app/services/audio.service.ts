import { Injectable } from '@angular/core';
import data from '../pages/training-set/data.json';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private readonly playbackRate = 1.1;

  constructor() {}

  playExerciseIntro(
    exerciseId: string,
    activeSeconds: number,
    repetitions: boolean = false
  ): void {
    if (repetitions) {
      this.playAudio(`/voices/${exerciseId}_r${activeSeconds}.mp3`);
    } else {
      this.playAudio(`/voices/${exerciseId}_${activeSeconds}.mp3`);
    }
  }

  playCountdownStart(): void {
    this.playAudio('/voices/countdown_start.mp3');
  }

  playCountdown(number: number): void {
    if (number >= 1 && number <= 3) {
      this.playAudio(`/voices/countdown_${number}.mp3`);
    }
  }

  playHalfway(): void {
    this.playAudio('/voices/halfway.mp3');
  }

  playRandomHint(exerciseId: string): void {
    const hints =
      data.exercises[exerciseId as keyof typeof data.exercises]?.hints;
    if (hints && hints.length > 0) {
      const random = Math.floor(Math.random() * hints.length);
      const hint = hints[random].id;
      this.playAudio(`/voices/${hint}.mp3`);
    }
  }

  private playAudio(src: string): void {
    const audio = new Audio(src);
    audio.playbackRate = this.playbackRate;
    audio
      .play()
      .catch((error) => console.error('Error playing audio:', error, src));
  }
}

import { Injectable } from '@angular/core';
import data from '../../data.json';
import { WorkoutStreakService } from '../services/workout-streak.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  hints(exerciseId: string): {id: string, voice: string}[] {
    return data.exercises[exerciseId as keyof typeof data.exercises]?.hints;
  }
  constructor(private workoutStreakService: WorkoutStreakService) {}

  title(id: string): string {
    return data.exercises[id as keyof typeof data.exercises].title;
  }

  workouts(): ExerciseDetails[] {
    return Object.keys(data.workouts).map((key) => {
      return {
        id: key,
        title: data.workouts[key as keyof typeof data.workouts].title,
        description:
          data.workouts[key as keyof typeof data.workouts].description,
        duration: data.workouts[key as keyof typeof data.workouts].duration,
        currentStreak: this.workoutStreakService.getCurrentStreak(key),
      };
    });
  }
}

export interface ExerciseDetails {
  title: string;
  id: string;
  description: string;
  duration: number;
  currentStreak: number;
}

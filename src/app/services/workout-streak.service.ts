import { Injectable } from '@angular/core';

export interface WorkoutStreak {
  workoutId: string;
  currentStreak: number;
  lastCompletedDate: string; // ISO date string (YYYY-MM-DD)
  bestStreak: number;
  totalCompletions: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutStreakService {
  private streaks: Map<string, WorkoutStreak> = new Map();
  private storageKey = 'workout-streaks';
  
  constructor() {
    this.loadStreaks();
  }
  
  /**
   * Record a workout completion and update the streak
   * @param workoutId The ID of the completed workout
   * @param completionDate Optional completion date (defaults to today)
   */
  recordWorkoutCompletion(workoutId: string, completionDate?: Date): void {
    const today = completionDate ? this.formatDate(completionDate) : this.formatDate(new Date());
    const streak = this.streaks.get(workoutId) || this.createNewStreak(workoutId);
    
    // Check if already completed today
    if (streak.lastCompletedDate === today) {
      return; // Don't update if already completed today
    }
    
    const lastDate = new Date(streak.lastCompletedDate + 'T00:00:00');
    const currentDate = new Date(today + 'T00:00:00');
    const daysDifference = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference === 1) {
      // Consecutive day - increment streak
      streak.currentStreak++;
    } else if (daysDifference > 1) {
      // Missed days - reset streak
      streak.currentStreak = 1;
    }
    // If daysDifference === 0, it means same day (shouldn't happen due to check above)
    
    // Update other fields
    streak.lastCompletedDate = today;
    streak.totalCompletions++;
    
    // Update best streak if current is better
    if (streak.currentStreak > streak.bestStreak) {
      streak.bestStreak = streak.currentStreak;
    }
    
    this.streaks.set(workoutId, streak);
    this.saveStreaks();
  }
  
  /**
   * Get the current streak for a specific workout
   * @param workoutId The workout ID
   * @returns The current streak count
   */
  getCurrentStreak(workoutId: string): number {
    this.updateStreakIfNeeded(workoutId);
    return this.streaks.get(workoutId)?.currentStreak || 0;
  }
  
  /**
   * Get the best streak for a specific workout
   * @param workoutId The workout ID
   * @returns The best streak count
   */
  getBestStreak(workoutId: string): number {
    return this.streaks.get(workoutId)?.bestStreak || 0;
  }
  
  /**
   * Get the total completions for a specific workout
   * @param workoutId The workout ID
   * @returns The total number of completions
   */
  getTotalCompletions(workoutId: string): number {
    return this.streaks.get(workoutId)?.totalCompletions || 0;
  }
  
  /**
   * Get the full streak data for a specific workout
   * @param workoutId The workout ID
   * @returns The workout streak data or null if not found
   */
  getWorkoutStreak(workoutId: string): WorkoutStreak | null {
    this.updateStreakIfNeeded(workoutId);
    return this.streaks.get(workoutId) || null;
  }
  
  /**
   * Get all workout streaks
   * @returns Map of all workout streaks
   */
  getAllStreaks(): Map<string, WorkoutStreak> {
    // Update all streaks before returning
    this.streaks.forEach((_, workoutId) => {
      this.updateStreakIfNeeded(workoutId);
    });
    return new Map(this.streaks);
  }
  
  /**
   * Check if a workout was completed today
   * @param workoutId The workout ID
   * @returns True if completed today, false otherwise
   */
  isCompletedToday(workoutId: string): boolean {
    const streak = this.streaks.get(workoutId);
    if (!streak) return false;
    
    const today = this.formatDate(new Date());
    return streak.lastCompletedDate === today;
  }
  
  /**
   * Reset all streaks (for testing purposes)
   */
  resetAllStreaks(): void {
    this.streaks.clear();
    this.saveStreaks();
  }
  
  /**
   * Delete a specific workout's streak data
   * @param workoutId The workout ID to delete
   */
  deleteWorkoutStreak(workoutId: string): void {
    this.streaks.delete(workoutId);
    this.saveStreaks();
  }
  
  private createNewStreak(workoutId: string): WorkoutStreak {
    return {
      workoutId,
      currentStreak: 0,
      lastCompletedDate: '1970-01-01', // Default old date
      bestStreak: 0,
      totalCompletions: 0
    };
  }
  
  private updateStreakIfNeeded(workoutId: string): void {
    const streak = this.streaks.get(workoutId);
    if (!streak || streak.currentStreak === 0) return;
    
    const today = this.formatDate(new Date());
    const lastDate = new Date(streak.lastCompletedDate + 'T00:00:00');
    const currentDate = new Date(today + 'T00:00:00');
    const daysDifference = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // If more than 1 day has passed since last completion, reset streak
    if (daysDifference > 1) {
      streak.currentStreak = 0;
      this.streaks.set(workoutId, streak);
      this.saveStreaks();
    }
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }
  
  private saveStreaks(): void {
    try {
      const streaksArray = Array.from(this.streaks.entries()).map(([id, streak]) => ({
        id,
        ...streak
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(streaksArray));
    } catch (error) {
      console.error('Error saving workout streaks:', error);
    }
  }
  
  private loadStreaks(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const streaksArray = JSON.parse(stored);
        this.streaks.clear();
        streaksArray.forEach((item: any) => {
          const { id, ...streak } = item;
          this.streaks.set(id, streak);
        });
      }
    } catch (error) {
      console.error('Error loading workout streaks:', error);
    }
  }
}

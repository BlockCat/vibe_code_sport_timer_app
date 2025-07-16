import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ExerciseSetOverviewComponent } from '../../components/exercise-set-overview/exercise-set-overview.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { WorkoutStreakService } from '../../services/workout-streak.service';
import { DataService, ExerciseDetails } from '../../utils/data.helper';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ExerciseSetOverviewComponent, LoadingSpinnerComponent, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  loading = false;

  constructor(private router: Router, private dataService: DataService) {}

  openExercise(id: string): void {
    this.loading = true;
    this.router.navigate(['/training', id]);
  }

  workouts(): ExerciseDetails[] {
    return this.dataService.workouts();
  }
}

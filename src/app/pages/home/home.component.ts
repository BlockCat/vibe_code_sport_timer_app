import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExerciseSetOverviewComponent } from "../../components/exercise-set-overview/exercise-set-overview.component";
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import data from "../training-set/data.json";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ExerciseSetOverviewComponent, LoadingSpinnerComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  loading = false;
  
  constructor(private router: Router) { }

  openExercise(id: string): void {
    this.loading = true;
    this.router.navigate(['/training', id]);
  }

  workouts(): { title: string, id: string, description: string, duration: number }[] {
    return Object.keys(data.workouts).map(key => {
      return {
        id: key,
        title: data.workouts[key as keyof typeof data.workouts].title,
        description: data.workouts[key as keyof typeof data.workouts].description,
        duration: data.workouts[key as keyof typeof data.workouts].duration,
      };
    })
  }
}

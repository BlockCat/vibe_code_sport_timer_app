import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TrainingSetComponent } from './pages/training-set/training-set.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ScheduledWorkoutsComponent } from './pages/scheduled-workouts/scheduled-workouts.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'training/:id', component: TrainingSetComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'scheduled', component: ScheduledWorkoutsComponent },
];

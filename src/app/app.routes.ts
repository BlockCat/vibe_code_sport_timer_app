import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TrainingSetComponent } from './pages/training-set/training-set.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'training/:id', component: TrainingSetComponent },
];

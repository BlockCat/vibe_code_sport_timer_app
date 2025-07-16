import { Component, EventEmitter, Input, Output, input, output } from '@angular/core';

@Component({
  selector: 'app-exercise-set-overview',
  standalone: true,
  imports: [],
  templateUrl: './exercise-set-overview.component.html'
})
export class ExerciseSetOverviewComponent {
  title = input<string>('');
  description = input<string>('');
  estimatedTime = input<number>(0); // in minutes
  timesPerDay = input<number | undefined>();
  currentStreak = input<number>(0);
  
  clicked = output<void>();

  onPanelClick(): void {
    this.clicked.emit();
  }
}

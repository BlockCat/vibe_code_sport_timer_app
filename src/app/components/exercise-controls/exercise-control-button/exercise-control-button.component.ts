import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-exercise-control-button',
  imports: [],
  templateUrl: './exercise-control-button.component.html',
})
export class ExerciseControlButtonComponent {
  disabled = input<boolean>(false);

  click = output<void>();
}

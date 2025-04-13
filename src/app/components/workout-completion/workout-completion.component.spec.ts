import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutCompletionComponent } from './workout-completion.component';

describe('WorkoutCompletionComponent', () => {
  let component: WorkoutCompletionComponent;
  let fixture: ComponentFixture<WorkoutCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutCompletionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

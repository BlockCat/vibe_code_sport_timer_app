import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseSetInfoComponent } from './exercise-set-info.component';

describe('ExerciseSetInfoComponent', () => {
  let component: ExerciseSetInfoComponent;
  let fixture: ComponentFixture<ExerciseSetInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseSetInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseSetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

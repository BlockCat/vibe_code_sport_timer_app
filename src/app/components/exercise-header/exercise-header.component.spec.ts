import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseHeaderComponent } from './exercise-header.component';

describe('ExerciseHeaderComponent', () => {
  let component: ExerciseHeaderComponent;
  let fixture: ComponentFixture<ExerciseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

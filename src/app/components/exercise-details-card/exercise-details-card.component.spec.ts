import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDetailsCardComponent } from './exercise-details-card.component';
import { input, signal } from '@angular/core';

describe('ExerciseDetailsCardComponent', () => {
  let component: ExerciseDetailsCardComponent;
  let fixture: ComponentFixture<ExerciseDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDetailsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display preparing with name and seconds', () => {
    fixture.componentRef.setInput('preparing', true);
    fixture.componentRef.setInput('exerciseName', 'Test Exercise');
    fixture.componentRef.setInput('durationSeconds', 45);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'Preparing for Exercise'
    );
    expect(compiled.querySelector('p#exercise-name')?.textContent).toContain(
      'Test Exercise'
    );
    expect(
      compiled.querySelector('p#exercise-duration')?.textContent
    ).toContain('45 seconds');
  });

  it('should display active exercise without name and no seconds', () => {
    fixture.componentRef.setInput('preparing', false);
    fixture.componentRef.setInput('exerciseName', null);
    fixture.componentRef.setInput('durationSeconds', null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'Current Exercise'
    );
    expect(compiled.querySelector('p#exercise-name')?.textContent).toContain(
      'Not started'
    );
    expect(
      compiled.querySelector('p#exercise-duration')?.textContent
    ).toContain('-');
  });
});

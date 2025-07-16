import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDescriptionComponent } from './exercise-description.component';
import { input, signal } from '@angular/core';

describe('ExerciseDescriptionComponent', () => {
  let component: ExerciseDescriptionComponent;
  let fixture: ComponentFixture<ExerciseDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and description', () => {
    fixture.componentRef.setInput('title', 'Test Exercise');
    fixture.componentRef.setInput('description', 'This is a test exercise description.');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Test Exercise');
    expect(compiled.querySelector('p')?.textContent).toContain('This is a test exercise description.');
  });

  it('should handle empty title and description', () => {
    fixture.componentRef.setInput('title', undefined);
    fixture.componentRef.setInput('description', undefined);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')).toBeUndefined();
    expect(compiled.querySelector('p')?.textContent).toBe('No exercise selected');
  });



});

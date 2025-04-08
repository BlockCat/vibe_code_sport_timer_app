import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseSetOverviewComponent } from './exercise-set-overview.component';

describe('ExerciseSetOverviewComponent', () => {
  let component: ExerciseSetOverviewComponent;
  let fixture: ComponentFixture<ExerciseSetOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseSetOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseSetOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const testTitle = 'Test Exercise';
    fixture.componentRef.setInput('title', testTitle);
    fixture.detectChanges();
    
    const titleElement = fixture.nativeElement.querySelector('h3');
    expect(titleElement.textContent).toContain(testTitle);
  });

  it('should display the description', () => {
    const testDescription = 'This is a test description';
    fixture.componentRef.setInput('description', testDescription);
    fixture.detectChanges();
    
    const descriptionElement = fixture.nativeElement.querySelector('p');
    expect(descriptionElement.textContent).toContain(testDescription);
  });

  it('should display the estimated time', () => {
    const testTime = 30;
    fixture.componentRef.setInput('estimatedTime', testTime);
    fixture.detectChanges();
    
    const timeElement = fixture.nativeElement.querySelector('.flex.items-center');
    expect(timeElement.textContent).toContain(`${testTime} min`);
  });

  it('should display times per day when provided', () => {
    const testTimesPerDay = 3;
    fixture.componentRef.setInput('timesPerDay', testTimesPerDay);
    fixture.detectChanges();
    
    const timesPerDayElement = fixture.nativeElement.querySelectorAll('.flex.items-center')[1];
    expect(timesPerDayElement.textContent).toContain(`${testTimesPerDay}x/day`);
  });

  it('should not display times per day when not provided', () => {
    fixture.componentRef.setInput('timesPerDay', undefined);
    fixture.detectChanges();
    
    const timesPerDayElements = fixture.nativeElement.querySelectorAll('.flex.items-center');
    expect(timesPerDayElements.length).toBe(1); // Only the time element should be present
  });

  it('should emit clicked event when panel is clicked', () => {
    const clickedSpy = spyOn(component.clicked, 'emit');
    
    const panel = fixture.nativeElement.querySelector('div');
    panel.click();
    
    expect(clickedSpy).toHaveBeenCalled();
  });

  it('should have gold-colored icons', () => {
    const icons = fixture.nativeElement.querySelectorAll('svg');
    icons.forEach((icon: Element) => {
      expect(icon.classList.contains('text-amber-500')).toBeTrue();
    });
  });

  it('should have proper hover effects', () => {
    const panel = fixture.nativeElement.querySelector('div');
    expect(panel.classList.contains('hover:shadow-xl')).toBeTrue();
    expect(panel.classList.contains('hover:border-amber-400')).toBeTrue();
    expect(panel.classList.contains('hover:border-2')).toBeTrue();
  });
});

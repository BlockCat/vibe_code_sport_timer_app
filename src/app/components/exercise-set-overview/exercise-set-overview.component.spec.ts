import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
    
    // Set default values for inputs
    fixture.componentRef.setInput('title', 'Default Test Title');
    fixture.componentRef.setInput('description', 'Default test description');
    fixture.componentRef.setInput('estimatedTime', 30);
    
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
    expect(titleElement.textContent.trim()).toContain(testTitle);
  });

  it('should display the description', () => {
    const testDescription = 'This is a test description';
    fixture.componentRef.setInput('description', testDescription);
    fixture.detectChanges();
    
    const descriptionElement = fixture.nativeElement.querySelector('p');
    expect(descriptionElement.textContent.trim()).toContain(testDescription);
  });

  it('should display the estimated time', () => {
    const testTime = 30;
    fixture.componentRef.setInput('estimatedTime', testTime);
    fixture.detectChanges();
    
    const timeElement = fixture.debugElement.query(By.css('.flex.items-center div')).nativeElement;
    expect(timeElement.textContent.trim()).toContain(`${testTime} min`);
  });

  it('should display times per day when provided', () => {
    const testTimesPerDay = 3;
    fixture.componentRef.setInput('timesPerDay', testTimesPerDay);
    fixture.detectChanges();
    
    const timeElements = fixture.debugElement.queryAll(By.css('.flex.items-center div'));
    expect(timeElements.length).toBe(2); // Both time and times per day elements
    expect(timeElements[1].nativeElement.textContent).toContain(`${testTimesPerDay}x/day`);
  });

  it('should not display times per day when not provided', () => {
    fixture.componentRef.setInput('timesPerDay', undefined);
    fixture.detectChanges();
    
    const timeElements = fixture.debugElement.queryAll(By.css('.flex.items-center div'));
    expect(timeElements.length).toBe(1); // Only the time element should be present
  });

  it('should emit clicked event when panel is clicked', () => {
    spyOn(component.clicked, 'emit');
    
    const panel = fixture.nativeElement.querySelector('div');
    panel.click();
    
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should have gold-colored icons', () => {
    const icons = fixture.nativeElement.querySelectorAll('svg');
    for (let i = 0; i < icons.length; i++) {
      expect(icons[i].classList.contains('text-amber-500')).toBeTrue();
    }
  });

  it('should have proper hover effects', () => {
    const panel = fixture.nativeElement.querySelector('div');
    expect(panel.classList.contains('hover:shadow-xl')).toBeTrue();
    expect(panel.classList.contains('hover:border-amber-400')).toBeTrue();
    expect(panel.classList.contains('hover:border-2')).toBeTrue();
  });
});

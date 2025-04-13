import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerDisplayComponent } from './timer-display.component';
import { By } from '@angular/platform-browser';

describe('TimerDisplayComponent', () => {
  let component: TimerDisplayComponent;
  let fixture: ComponentFixture<TimerDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerDisplayComponent);
    component = fixture.componentInstance;
    
    // Set required inputs before detecting changes
    fixture.componentRef.setInput('seconds', 30);
    fixture.componentRef.setInput('milliseconds', '500');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display the timer values correctly', () => {
    // Get the div elements from the template
    const divElements = fixture.debugElement.queryAll(By.css('div'));
    
    // First div should contain seconds
    const secondsElement = divElements[0];
    // Second div should contain milliseconds
    const millisecondsElement = divElements[1];
    
    expect(secondsElement.nativeElement.textContent.trim()).toBe('30');
    expect(millisecondsElement.nativeElement.textContent.trim()).toBe('500');
    
    // Update timer values and check if display updates
    fixture.componentRef.setInput('seconds', 10);
    fixture.componentRef.setInput('milliseconds', '250');
    fixture.detectChanges();
    
    expect(secondsElement.nativeElement.textContent.trim()).toBe('10');
    expect(millisecondsElement.nativeElement.textContent.trim()).toBe('250');
  });
});

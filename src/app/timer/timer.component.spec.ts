import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TimerComponent } from './timer.component';
import { TimerDisplayComponent } from './timer-display/timer-display.component';
import { ProgressRingComponent } from './progress-ring/progress-ring.component';
import { provideZoneChangeDetection } from '@angular/core';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerComponent, TimerDisplayComponent, ProgressRingComponent],
      providers: [provideZoneChangeDetection({eventCoalescing: true})]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    fixture.componentRef.setInput('remainingMs', 30000); // 30 seconds
    fixture.componentRef.setInput('totalSeconds', 60); // 60 seconds total
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate progress correctly', () => {
    // 30 seconds remaining out of 60 seconds total = 50% progress
    expect(component.progress()).toBe(50);
    
    // Update remaining time
    fixture.componentRef.setInput('remainingMs', 15000); // 15 seconds
    fixture.detectChanges();
    
    // 15 seconds remaining out of 60 seconds total = 25% progress
    expect(component.progress()).toBe(25);
  });

  it('should calculate remaining seconds correctly', () => {
    fixture.componentRef.setInput('remainingMs', 31500); // 31.5 seconds
    fixture.detectChanges();
    
    expect(component.remainingSeconds()).toBe(31);
  });

  it('should format remaining milliseconds correctly', () => {
    fixture.componentRef.setInput('remainingMs', 31500); // 31.5 seconds = 31 seconds and 500ms
    fixture.detectChanges();
    
    expect(component.remainingMilliseconds()).toBe('500');
  });

  it('should pass correct values to progress ring', () => {
    const progressRing = fixture.debugElement.query(By.directive(ProgressRingComponent));
    expect(progressRing).toBeTruthy();
    
    const progressRingInstance = progressRing.componentInstance;
    expect(progressRingInstance.progress()).toBe(50); // 50% progress
  });

  it('should pass correct values to timer display', () => {
    const timerDisplay = fixture.debugElement.query(By.directive(TimerDisplayComponent));
    expect(timerDisplay).toBeTruthy();
    
    const timerDisplayInstance = timerDisplay.componentInstance;
    expect(timerDisplayInstance.seconds()).toBe(30); // 30 seconds remaining
    expect(timerDisplayInstance.milliseconds()).toBe('000'); // 0 milliseconds
  });
});
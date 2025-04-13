import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { TrainingSetComponent } from './training-set.component';
import { TimerService } from '../../utils/timer.service';
import { AudioService } from '../../services/audio.service';

describe('TrainingSetComponent', () => {
  let component: TrainingSetComponent;
  let fixture: ComponentFixture<TrainingSetComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTimerService: jasmine.SpyObj<TimerService>;
  let mockAudioService: jasmine.SpyObj<AudioService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockTimerService = jasmine.createSpyObj('TimerService', ['start', 'stop', 'pause', 'resume', 'getState']);
    mockAudioService = jasmine.createSpyObj('AudioService', [
      'playExerciseIntro',
      'playCountdownStart',
      'playCountdown',
      'playHalfway',
      'playRandomHint'
    ]);
    
    // Create a read-only signal for the timer state
    const mockSignal = signal({
      remainingMs: 5000,
      isRunning: false,
      totalMs: 10000
    }).asReadonly();
    
    mockTimerService.getState.and.returnValue(mockSignal);

    await TestBed.configureTestingModule({
      imports: [TrainingSetComponent],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: {
            params: of({ id: 'stretching' })
          }
        },
        { provide: Router, useValue: mockRouter },
        { provide: TimerService, useValue: mockTimerService },
        { provide: AudioService, useValue: mockAudioService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  // Add more specific tests for component functionality
  it('should navigate back on exit workout', () => {
    component.exitWorkout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});

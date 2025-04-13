import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TimerService } from './timer.service';

describe('TimerService', () => {
  let service: TimerService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerService);
  });

  afterEach(() => {
    service.stop();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state with 0 milliseconds and not running', () => {
    const state = service.getState()();
    expect(state.remainingMs).toBe(0);
    expect(state.isRunning).toBeFalse();
    expect(state.totalMs).toBe(0);
  });

  it('should start the timer with correct values', () => {
    const totalMs = 5000;
    service.start(totalMs, () => {}, () => {});
    
    const state = service.getState()();
    expect(state.remainingMs).toBe(totalMs);
    expect(state.isRunning).toBeTrue();
    expect(state.totalMs).toBe(totalMs);
  });

  it('should update remaining time and call onTick when timer runs', fakeAsync(() => {
    const totalMs = 1000;
    const onTickSpy = jasmine.createSpy('onTick');
    
    service.start(totalMs, onTickSpy, () => {});
    tick(100); // Advance timer by 100ms
    
    expect(onTickSpy).toHaveBeenCalledWith(900);
    expect(service.getState()().remainingMs).toBe(900);
  }));

  it('should call onComplete when timer finishes', fakeAsync(() => {
    const totalMs = 500;
    const onCompleteSpy = jasmine.createSpy('onComplete');
    
    service.start(totalMs, () => {}, onCompleteSpy);
    tick(500); // Advance timer to completion
    
    expect(onCompleteSpy).toHaveBeenCalled();
    expect(service.getState()().isRunning).toBeFalse();
  }));

  it('should stop timer when requested', () => {
    service.start(5000, () => {}, () => {});
    service.stop();
    
    const state = service.getState()();
    expect(state.isRunning).toBeFalse();
  });

  it('should pause and maintain remaining time', fakeAsync(() => {
    const totalMs = 5000;
    service.start(totalMs, () => {}, () => {});
    tick(1000); // Run for 1 second
    
    service.pause();
    const remainingAfterPause = service.getState()().remainingMs;
    
    expect(service.getState()().isRunning).toBeFalse();
    expect(remainingAfterPause).toBe(4000);
    
    // Make sure time doesn't continue to decrease while paused
    tick(1000);
    expect(service.getState()().remainingMs).toBe(remainingAfterPause);
  }));

  it('should resume timer from paused state', fakeAsync(() => {
    const totalMs = 5000;
    const onTickSpy = jasmine.createSpy('onTick');
    const onCompleteSpy = jasmine.createSpy('onComplete');
    
    service.start(totalMs, onTickSpy, onCompleteSpy);
    tick(1000); // Run for 1 second
    service.pause();
    
    // Clear calls from before pause
    onTickSpy.calls.reset();
    
    service.resume();
    expect(service.getState()().isRunning).toBeTrue();
    
    tick(100);
    expect(onTickSpy).toHaveBeenCalled();
  }));

  it('should reset the timer correctly', () => {
    service.start(5000, () => {}, () => {});
    service.reset(10);
    
    const state = service.getState()();
    expect(state.remainingMs).toBe(10000);
    expect(state.isRunning).toBeFalse();
    expect(state.totalMs).toBe(10000);
  });
});
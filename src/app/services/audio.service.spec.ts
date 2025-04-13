import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;
  let audioSpy: jasmine.SpyObj<HTMLAudioElement>;

  beforeEach(() => {
    // Create a spy for the Audio object
    audioSpy = jasmine.createSpyObj('HTMLAudioElement', ['play']);
    audioSpy.play.and.returnValue(Promise.resolve());
    
    // Mock the Audio constructor
    spyOn(window, 'Audio').and.returnValue(audioSpy);
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should play exercise intro with correct file path', () => {
    service.playExerciseIntro('test_exercise', 30);
    
    expect(window.Audio).toHaveBeenCalledWith('/voices/test_exercise_30.mp3');
    expect(audioSpy.play).toHaveBeenCalled();
    expect(audioSpy.playbackRate).toBe(1.1);
  });

  it('should play countdown start sound', () => {
    service.playCountdownStart();
    
    expect(window.Audio).toHaveBeenCalledWith('/voices/countdown_start.mp3');
    expect(audioSpy.play).toHaveBeenCalled();
  });

  it('should play countdown number sounds', () => {
    for (let i = 1; i <= 3; i++) {
      service.playCountdown(i);
      expect(window.Audio).toHaveBeenCalledWith(`/voices/countdown_${i}.mp3`);
      expect(audioSpy.play).toHaveBeenCalled();
    }
  });

  it('should not play countdown for invalid numbers', () => {
    service.playCountdown(0);
    service.playCountdown(4);
    
    // Audio should not be called with these values
    expect(window.Audio).not.toHaveBeenCalledWith('/voices/countdown_0.mp3');
    expect(window.Audio).not.toHaveBeenCalledWith('/voices/countdown_4.mp3');
  });

  it('should play halfway sound', () => {
    service.playHalfway();
    
    expect(window.Audio).toHaveBeenCalledWith('/voices/halfway.mp3');
    expect(audioSpy.play).toHaveBeenCalled();
  });
  
  it('should play random hint with valid exercise ID', () => {
    // This test is a bit tricky since we're using real data and random selection
    // We'll just verify that Audio is constructed and play is called
    service.playRandomHint('left_quadriceps_stretch');
    
    expect(window.Audio).toHaveBeenCalled();
    expect(audioSpy.play).toHaveBeenCalled();
  });

  it('should handle errors when playing audio', () => {
    // Setup the audio spy to reject
    audioSpy.play.and.returnValue(Promise.reject('Error playing'));
    
    // We need to spy on console.error to prevent test output being cluttered
    spyOn(console, 'error');
    
    service.playCountdownStart();
    
    expect(audioSpy.play).toHaveBeenCalled();
    // Error will be caught and logged
  });
});

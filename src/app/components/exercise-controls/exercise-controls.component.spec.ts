import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ExerciseControlsComponent } from './exercise-controls.component';
import { ExerciseState } from '../../shared/exercise-state.enum';

describe('ExerciseControlsComponent', () => {
  let component: ExerciseControlsComponent;
  let fixture: ComponentFixture<ExerciseControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show Start button in prepare state', () => {
    fixture.componentRef.setInput('state', ExerciseState.Prepare);
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent.trim()).toBe('Start');
    
    // Check button styling
    expect(button.nativeElement.classList.contains('bg-indigo-600')).toBeTrue();
    expect(button.nativeElement.classList.contains('text-white')).toBeTrue();
  });

  it('should show Pause button in active state', () => {
    fixture.componentRef.setInput('state', ExerciseState.Active);
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent.trim()).toBe('Pause');
    
    // Check button styling
    expect(button.nativeElement.classList.contains('bg-gray-200')).toBeTrue();
    expect(button.nativeElement.classList.contains('text-gray-700')).toBeTrue();
  });

  it('should show Resume button in pause state', () => {
    fixture.componentRef.setInput('state', ExerciseState.Pause);
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent.trim()).toBe('Resume');
    
    // Check button styling
    expect(button.nativeElement.classList.contains('bg-indigo-600')).toBeTrue();
    expect(button.nativeElement.classList.contains('text-white')).toBeTrue();
  });

  it('should show disabled Finished button in finished state', () => {
    fixture.componentRef.setInput('state', ExerciseState.Finished);
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.textContent.trim()).toBe('Finished');
    expect(button.nativeElement.disabled).toBeTrue();
    
    // Check button styling
    expect(button.nativeElement.classList.contains('bg-gray-200')).toBeTrue();
    expect(button.nativeElement.classList.contains('text-gray-400')).toBeTrue();
    expect(button.nativeElement.classList.contains('cursor-not-allowed')).toBeTrue();
  });

  it('should emit start event when Start button is clicked', () => {
    fixture.componentRef.setInput('state', ExerciseState.Prepare);
    fixture.detectChanges();
    
    spyOn(component.start, 'emit');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    
    expect(component.start.emit).toHaveBeenCalled();
  });

  it('should emit pause event when Pause button is clicked', () => {
    fixture.componentRef.setInput('state', ExerciseState.Active);
    fixture.detectChanges();
    
    spyOn(component.pause, 'emit');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    
    expect(component.pause.emit).toHaveBeenCalled();
  });

  it('should emit resume event when Resume button is clicked', () => {
    fixture.componentRef.setInput('state', ExerciseState.Pause);
    fixture.detectChanges();
    
    spyOn(component.resume, 'emit');
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    
    expect(component.resume.emit).toHaveBeenCalled();
  });

  it('should not show any button when state is null', () => {
    fixture.componentRef.setInput('state', null);
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeNull();
  });
});
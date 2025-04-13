import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WorkoutCompletionComponent } from './workout-completion.component';

describe('WorkoutCompletionComponent', () => {
  let component: WorkoutCompletionComponent;
  let fixture: ComponentFixture<WorkoutCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutCompletionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should show workout completion message', () => {
    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.textContent).toContain('Workout Complete!');
  });

  it('should emit startAgain event when Start Again button is clicked', () => {
    spyOn(component.startAgain, 'emit');
    
    const startAgainButton = fixture.debugElement.queryAll(By.css('button'))[0];
    startAgainButton.triggerEventHandler('click', null);
    
    expect(component.startAgain.emit).toHaveBeenCalled();
  });

  it('should emit exit event when Exit button is clicked', () => {
    spyOn(component.exit, 'emit');
    
    const exitButton = fixture.debugElement.queryAll(By.css('button'))[1];
    exitButton.triggerEventHandler('click', null);
    
    expect(component.exit.emit).toHaveBeenCalled();
  });

  it('should have proper styling for buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    
    // Start Again button should have indigo background
    expect(buttons[0].nativeElement.classList.contains('bg-indigo-600')).toBeTrue();
    expect(buttons[0].nativeElement.classList.contains('text-white')).toBeTrue();
    
    // Exit button should have gray background
    expect(buttons[1].nativeElement.classList.contains('bg-gray-200')).toBeTrue();
    expect(buttons[1].nativeElement.classList.contains('text-gray-700')).toBeTrue();
  });
});

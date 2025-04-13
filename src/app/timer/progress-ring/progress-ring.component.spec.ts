import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressRingComponent } from './progress-ring.component';

describe('ProgressRingComponent', () => {
  let component: ProgressRingComponent;
  let fixture: ComponentFixture<ProgressRingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressRingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressRingComponent);
    component = fixture.componentInstance;
    
    // Set the required progress input before detecting changes
    fixture.componentRef.setInput('progress', 50);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display the correct progress value', () => {
    expect(component.progress()).toBe(50);
    
    // Update progress and verify it changed
    fixture.componentRef.setInput('progress', 75);
    fixture.detectChanges();
    expect(component.progress()).toBe(75);
  });
});

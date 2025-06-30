import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportTimerComponent } from './sport-timer.component';

describe('SportTimerComponent', () => {
  let component: SportTimerComponent;
  let fixture: ComponentFixture<SportTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

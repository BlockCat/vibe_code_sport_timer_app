import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportRecoveryComponent } from './sport-recovery.component';

describe('SportBreakComponent', () => {
  let component: SportRecoveryComponent;
  let fixture: ComponentFixture<SportRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportRecoveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

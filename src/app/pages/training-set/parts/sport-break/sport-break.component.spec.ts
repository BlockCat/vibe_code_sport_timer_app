import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportBreakComponent } from './sport-break.component';

describe('SportBreakComponent', () => {
  let component: SportBreakComponent;
  let fixture: ComponentFixture<SportBreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportBreakComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

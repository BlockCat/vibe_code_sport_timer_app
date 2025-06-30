import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportCompleteComponent } from './sport-complete.component';

describe('SportCompleteComponent', () => {
  let component: SportCompleteComponent;
  let fixture: ComponentFixture<SportCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportCompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

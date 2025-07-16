import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportClickerComponent } from './sport-clicker.component';

describe('SportClickerComponent', () => {
  let component: SportClickerComponent;
  let fixture: ComponentFixture<SportClickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportClickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportClickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

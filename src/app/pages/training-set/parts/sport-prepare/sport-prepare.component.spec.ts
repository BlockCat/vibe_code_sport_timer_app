import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportPrepareComponent } from './sport-prepare.component';

describe('SportPrepareComponent', () => {
  let component: SportPrepareComponent;
  let fixture: ComponentFixture<SportPrepareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportPrepareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportPrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

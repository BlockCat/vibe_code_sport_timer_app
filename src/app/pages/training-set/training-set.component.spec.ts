import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSetComponent } from './training-set.component';

describe('TrainingSetComponent', () => {
  let component: TrainingSetComponent;
  let fixture: ComponentFixture<TrainingSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingSetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

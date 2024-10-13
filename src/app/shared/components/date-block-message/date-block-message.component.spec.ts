import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateBlockMessageComponent } from './date-block-message.component';

describe('DateBlockMessageComponent', () => {
  let component: DateBlockMessageComponent;
  let fixture: ComponentFixture<DateBlockMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateBlockMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DateBlockMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

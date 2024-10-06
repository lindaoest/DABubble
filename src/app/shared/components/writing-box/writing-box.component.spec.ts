import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingBoxComponent } from './writing-box.component';

describe('WritingBoxComponent', () => {
  let component: WritingBoxComponent;
  let fixture: ComponentFixture<WritingBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WritingBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WritingBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMessageButtonComponent } from './edit-message-button.component';

describe('EditMessageButtonComponent', () => {
  let component: EditMessageButtonComponent;
  let fixture: ComponentFixture<EditMessageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMessageButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMessageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

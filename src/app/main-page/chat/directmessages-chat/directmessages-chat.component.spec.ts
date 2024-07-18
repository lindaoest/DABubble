import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectmessagesChatComponent } from './directmessages-chat.component';

describe('DirectmessagesChatComponent', () => {
  let component: DirectmessagesChatComponent;
  let fixture: ComponentFixture<DirectmessagesChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectmessagesChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectmessagesChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMemberExistingChannelComponent } from './dialog-member-existing-channel.component';

describe('DialogMemberExistingChannelComponent', () => {
  let component: DialogMemberExistingChannelComponent;
  let fixture: ComponentFixture<DialogMemberExistingChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogMemberExistingChannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogMemberExistingChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOverviewChannelComponent } from './dialog-overview-channel.component';

describe('DialogOverviewChannelComponent', () => {
  let component: DialogOverviewChannelComponent;
  let fixture: ComponentFixture<DialogOverviewChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogOverviewChannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogOverviewChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

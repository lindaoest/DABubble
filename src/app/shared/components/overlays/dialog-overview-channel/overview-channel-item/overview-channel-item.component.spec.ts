import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewChannelItemComponent } from './overview-channel-item.component';

describe('OverviewChannelItemComponent', () => {
  let component: OverviewChannelItemComponent;
  let fixture: ComponentFixture<OverviewChannelItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewChannelItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewChannelItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

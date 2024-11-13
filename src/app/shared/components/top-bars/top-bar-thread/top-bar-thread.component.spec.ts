import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarThreadComponent } from './top-bar-thread.component';

describe('TopBarThreadComponent', () => {
  let component: TopBarThreadComponent;
  let fixture: ComponentFixture<TopBarThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarThreadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopBarThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

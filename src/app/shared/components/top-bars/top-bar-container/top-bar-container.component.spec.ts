import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarContainerComponent } from './top-bar-container.component';

describe('TopBarContainerComponent', () => {
  let component: TopBarContainerComponent;
  let fixture: ComponentFixture<TopBarContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopBarContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

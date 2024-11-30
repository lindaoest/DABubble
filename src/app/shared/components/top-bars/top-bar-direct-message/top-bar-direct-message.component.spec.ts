import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarDirectMessageComponent } from './top-bar-direct-message.component';

describe('TopBarDirectMessageComponent', () => {
  let component: TopBarDirectMessageComponent;
  let fixture: ComponentFixture<TopBarDirectMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarDirectMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopBarDirectMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

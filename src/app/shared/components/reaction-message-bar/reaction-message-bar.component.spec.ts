import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionMessageBarComponent } from './reaction-message-bar.component';

describe('ReactionMessageBarComponent', () => {
  let component: ReactionMessageBarComponent;
  let fixture: ComponentFixture<ReactionMessageBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionMessageBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReactionMessageBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

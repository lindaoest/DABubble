import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonCloseMenuComponent } from './button-close-menu.component';

describe('ButtonCloseMenuComponent', () => {
  let component: ButtonCloseMenuComponent;
  let fixture: ComponentFixture<ButtonCloseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonCloseMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonCloseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

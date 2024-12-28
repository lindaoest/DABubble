import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSelectMembersComponent } from './input-select-members.component';

describe('InputSelectMembersComponent', () => {
  let component: InputSelectMembersComponent;
  let fixture: ComponentFixture<InputSelectMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSelectMembersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputSelectMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

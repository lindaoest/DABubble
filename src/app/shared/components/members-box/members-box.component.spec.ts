import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersBoxComponent } from './members-box.component';

describe('MembersBoxComponent', () => {
  let component: MembersBoxComponent;
  let fixture: ComponentFixture<MembersBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembersBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

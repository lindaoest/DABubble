import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteMenuDropDownComponent } from './site-menu-drop-down.component';

describe('SiteMenuDropDownComponent', () => {
  let component: SiteMenuDropDownComponent;
  let fixture: ComponentFixture<SiteMenuDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteMenuDropDownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteMenuDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

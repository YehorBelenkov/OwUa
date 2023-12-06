import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatenewpasswordComponent } from './createnewpassword.component';

describe('CreatenewpasswordComponent', () => {
  let component: CreatenewpasswordComponent;
  let fixture: ComponentFixture<CreatenewpasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatenewpasswordComponent]
    });
    fixture = TestBed.createComponent(CreatenewpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

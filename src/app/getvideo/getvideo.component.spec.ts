import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetvideoComponent } from './getvideo.component';

describe('GetvideoComponent', () => {
  let component: GetvideoComponent;
  let fixture: ComponentFixture<GetvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetvideoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

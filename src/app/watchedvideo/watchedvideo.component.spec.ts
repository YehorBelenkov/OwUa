import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchedvideoComponent } from './watchedvideo.component';

describe('WatchedvideoComponent', () => {
  let component: WatchedvideoComponent;
  let fixture: ComponentFixture<WatchedvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchedvideoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WatchedvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

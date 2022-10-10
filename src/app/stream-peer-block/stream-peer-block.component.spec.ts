import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamPeerBlockComponent } from './stream-peer-block.component';

describe('StreamPeerBlockComponent', () => {
  let component: StreamPeerBlockComponent;
  let fixture: ComponentFixture<StreamPeerBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamPeerBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamPeerBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerConnectionDialogComponent } from './peer-connection-dialog.component';

describe('PeerConnectionDialogComponent', () => {
  let component: PeerConnectionDialogComponent;
  let fixture: ComponentFixture<PeerConnectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerConnectionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeerConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamScreenPickerComponent } from './stream-screen-picker.component';

describe('StreamScreenPickerComponent', () => {
  let component: StreamScreenPickerComponent;
  let fixture: ComponentFixture<StreamScreenPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamScreenPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamScreenPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

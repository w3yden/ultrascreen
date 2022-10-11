import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ElectronService } from '../core/services';


@Component({
  selector: 'app-stream-screen-picker',
  templateUrl: './stream-screen-picker.component.html',
  styleUrls: ['./stream-screen-picker.component.scss']
})
export class StreamScreenPickerComponent implements OnInit {
  @Output() mediaStreamSelected: EventEmitter<MediaStream> = new EventEmitter();
  display = false;
  sources: any;

  constructor(private electronService: ElectronService) {
  }

  ngOnInit(): void {
  }

  showPicker() {
    if (this.electronService.isElectron) {
      console.log(this.electronService);
      this.electronService.ipcRenderer.invoke('get-desktop-sources').then((srcs) => {
        console.log(srcs);
        this.sources = srcs;
        this.display = true;
      });
    } else {
      navigator.mediaDevices.getDisplayMedia().then((stream) => {
        this.mediaStreamSelected.emit(stream);
      });
    }

  }

  selectWindow(source) {
    this.display = false;
    (navigator.mediaDevices as any).getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      }
    }).then((stream) => {
      this.mediaStreamSelected.emit(stream);
    });
  }

}

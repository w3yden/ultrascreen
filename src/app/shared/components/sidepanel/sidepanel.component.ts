import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.scss'],
  animations: [
    trigger('expandedCollapsed', [
      state('expanded', style({
          transform: 'translateX(0%)'
      })),
      state('collapsed', style({
          transform: 'translateX(-95%)'
      })),
      transition('expanded => collapsed', [
        animate('0.25s ease-out')
      ]),
      transition('collapsed => expanded', [
        animate('0.25s ease-in')
      ])
    ])
  ]
})
export class SidepanelComponent implements OnInit {

  constructor() { }

  @Input()
  public panelTemplate: TemplateRef<any>;

  ngOnInit(): void {
  }

  public toggleExpanded() {
    this.expanded = !this.expanded;
  }



  expanded = true;

}

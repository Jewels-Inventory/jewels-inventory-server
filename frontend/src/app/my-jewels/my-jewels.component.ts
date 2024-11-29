import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceListComponent } from '../device-list/device-list.component';

@Component({
  selector: 'app-my-jewels',
  templateUrl: './my-jewels.component.html',
  styleUrl: './my-jewels.component.scss',
  standalone: false
})
export class MyJewelsComponent implements OnInit {
  @ViewChild(DeviceListComponent) protected deviceListComponent!: DeviceListComponent;

  ngOnInit(): void {
    setTimeout(() => {
      this.deviceListComponent.setOwner(null);
    });
  }
}

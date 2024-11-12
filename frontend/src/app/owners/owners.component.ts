import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceListComponent } from '../device-list/device-list.component';
import { Owner } from '../api/models/owner';
import { OwnerService } from '../api/services/owner.service';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrl: './owners.component.scss'
})
export class OwnersComponent implements OnInit {
  @ViewChild(DeviceListComponent) protected deviceListComponent!: DeviceListComponent;

  protected owners: Owner[] = [];

  protected selectedOwner: Owner | null = null;

  constructor(private readonly ownerService: OwnerService) {}

  ngOnInit(): void {
    this.ownerService.getAllOwners().subscribe({
      next: (owners) => {
        this.owners = owners;
        setTimeout(() => {
          this.selectOwner(owners[0]);
        });
      }
    });
  }

  protected selectOwner(owner: Owner) {
    this.selectedOwner = owner;
    this.deviceListComponent.setOwner(owner);
  }
}

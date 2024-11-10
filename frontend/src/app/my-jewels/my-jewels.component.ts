import { Component, OnInit } from '@angular/core';
import { MyJewelsService } from '../api/services/my-jewels.service';
import { Device } from '../api/models/device';
import { Type } from '../api/models';
import { LucidePlus } from 'lucide-angular';
import { AddJewelComponent } from '../add-jewel/add-jewel.component';
import { FormControl, FormGroup } from '@angular/forms';
import { EditJewelComponent } from '../edit-jewel/edit-jewel.component';

enum DetailsTab {
  Software,
  Hardware,
  Device,
  Storage,
  Notes
}

@Component({
  selector: 'app-my-jewels',
  templateUrl: './my-jewels.component.html',
  styleUrl: './my-jewels.component.scss'
})
export class MyJewelsComponent implements OnInit {
  protected readonly LucidePlus = LucidePlus;
  protected readonly Type = Type;
  protected readonly DetailsTab = DetailsTab;

  protected myJewels: Device[] | null = null;

  protected currentDeviceId: string | null = null;

  protected loading = true;
  protected hasError = false;
  protected addHasError = false;
  protected editHasError = false;
  protected deleteHasError = false;
  protected deleteOpen = false;

  protected detailsTab = DetailsTab.Device;

  protected searchTerm = '';

  protected deviceTypeFilter = new Set([Type.Phone, Type.Computer, Type.Other, Type.Watch]);

  protected notesEditor = new FormGroup({
    notes: new FormControl('')
  });

  constructor(private readonly myJewelsService: MyJewelsService) {
  }

  get devices() {
    return (
      this.myJewels
        ?.filter(
          (d) =>
            d.model.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase()) ||
            d.hostname?.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase()) ||
            d.manufacturer.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase())
        )
        .filter((d) => this.deviceTypeFilter.has(d.type)) ?? []
    );
  }

  get selectedDevice(): Device | null {
    if (!this.devices.find((d) => d.id === this.currentDeviceId)) {
      if (this.devices.length > 0) {
        this.selectDevice(this.devices[0]);
      } else {
        this.currentDeviceId = null;
      }
    }

    return this.devices.find((device) => device.id === this.currentDeviceId) ?? null;
  }

  get selectedDrives() {
    return this.selectedDevice?.drives?.filter((d) => d.size > 0) ?? [];
  }

  get availableTypes() {
    return [...new Set(this.myJewels?.map((jewel) => jewel.type) ?? [])];
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadJewels();
  }

  private loadJewels() {
    this.myJewelsService.getMyJewels().subscribe({
      next: (data) => {
        this.myJewels = data.map((jewel) => ({
          ...jewel,
          eol: jewel.eol ? new Date(Date.parse(jewel.eol as unknown as string)) : undefined
        }));
      },
      error: (error) => {
        this.hasError = true;
        console.error(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  protected toggleFilter(type: Type) {
    if (this.deviceTypeFilter.has(type)) {
      this.deviceTypeFilter.delete(type);
    } else {
      this.deviceTypeFilter.add(type);
    }
  }

  protected deleteDevice() {
    this.deleteHasError = false;
    this.myJewelsService.deleteMyJewel({ id: this.currentDeviceId! }).subscribe({
      next: () => {
        this.myJewels = this.myJewels?.filter((d) => d.id !== this.currentDeviceId) ?? [];
        this.currentDeviceId = null;
        this.deleteOpen = false;
      },
      error: () => {
        this.deleteHasError = true;
      }
    });
  }

  protected saveManuelJewel(addJewel: AddJewelComponent, device: Device) {
    this.myJewelsService.createMyJewel({ body: { mode: 'manual', jewel: device } }).subscribe({
      next: (jewel) => {
        this.currentDeviceId = jewel.id;
        this.myJewels?.push(jewel);
        addJewel.close();
      },
      error: () => {
        this.addHasError = true;
      }
    });
  }

  protected saveCodeJewel(addJewel: AddJewelComponent, token: string) {
    this.myJewelsService.createMyJewel({ body: { mode: 'auto', token } }).subscribe({
      next: () => {
        this.loadJewels();
        addJewel.close();
      },
      error: () => {
        this.addHasError = true;
      }
    });
  }

  protected selectDevice(device: Device) {
    this.currentDeviceId = device.id;
    this.detailsTab = DetailsTab.Device;
    this.notesEditor.reset({ notes: this.selectedDevice?.notes ?? '' });
  }

  protected saveNotes() {
    this.myJewelsService
      .updateMyJewel({
        id: this.currentDeviceId!,
        body: { ...this.selectedDevice!, notes: this.notesEditor.controls.notes.value ?? '' }
      })
      .subscribe({});
  }

  protected updateJewel(editJewel: EditJewelComponent, device: Device) {
    this.myJewelsService
      .updateMyJewel({
        id: device.id,
        body: { ...device }
      })
      .subscribe({
        next: () => {
          editJewel.close();
          this.editHasError = false;
        },
        error: () => {
          this.editHasError = true;
        }
      });
  }
}

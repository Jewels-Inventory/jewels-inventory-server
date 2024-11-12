import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from '../api/models/device';
import { Type } from '../api/models';
import { CpuManufacturer, requiredWithCondition } from '../add-jewel/add-jewel.component';

@Component({
  selector: 'app-edit-jewel',
  templateUrl: './edit-jewel.component.html',
  styleUrl: './edit-jewel.component.scss'
})
export class EditJewelComponent {
  @Output() public save = new EventEmitter<Device>();

  @Input() public hasError = false;
  @Input() public device!: Device;

  protected isOpen = false;

  protected readonly Type = Type;
  protected readonly CpuManufacturer = CpuManufacturer;

  protected formGroup = new FormGroup(
    {
      type: new FormControl<Type>(Type.Computer, {
        updateOn: 'change',
        validators: Validators.required
      }),
      model: new FormControl('', Validators.required),
      hostname: new FormControl(
        '',
        requiredWithCondition((control) => control.parent?.value.type === Type.Computer)
      ),
      manufacturer: new FormControl(
        '',
        requiredWithCondition(
          (control) => control.parent?.value.type === Type.Computer || control.parent?.value.type === Type.Phone
        )
      ),
      operatingSystem: new FormControl(
        '',
        requiredWithCondition((control) => control.parent?.value.type === Type.Computer)
      ),
      operatingSystemVersion: new FormControl(''),
      storage: new FormControl(
        0.0,
        requiredWithCondition((control) => control.parent?.value.type === Type.Computer)
      ),
      ram: new FormControl(
        0.0,
        requiredWithCondition((control) => control.parent?.value.type === Type.Computer)
      ),
      cpuManufacturer: new FormControl(
        'Intel',
        requiredWithCondition((control) => control.parent?.value.type === Type.Computer)
      ),
      cpuModel: new FormControl(
        'Unbekannt',
        requiredWithCondition((control) => control.parent?.value.type === Type.Computer)
      ),
      cpuSpeed: new FormControl(0.0),
      cpuCores: new FormControl(0.0),
      cpuThreads: new FormControl(0.0),
      eol: new FormControl<string | null>(null)
    },
    {
      updateOn: 'submit'
    }
  );

  public open() {
    this.isOpen = true;
    this.formGroup.reset({
      type: this.device.type,
      hostname: this.device.hostname,
      eol: this.device.eol?.toISOString().substring(0, 10),
      ram: this.device.ram,
      model: this.device.model,
      manufacturer: this.device.manufacturer,
      storage: this.device.storage,
      cpuModel: this.device.cpu?.model,
      cpuManufacturer: this.device.cpu?.manufacturer,
      cpuCores: this.device.cpu?.cores,
      cpuSpeed: this.device.cpu?.speed,
      cpuThreads: this.device.cpu?.threads,
      operatingSystem: this.device.os?.name,
      operatingSystemVersion: this.device.os?.version
    });
  }

  public close() {
    this.isOpen = false;
  }

  protected saveDevice() {
    this.formGroup.controls.ram.updateValueAndValidity();
    this.formGroup.controls.hostname.updateValueAndValidity();
    this.formGroup.controls.storage.updateValueAndValidity();
    this.formGroup.controls.manufacturer.updateValueAndValidity();
    this.formGroup.controls.operatingSystem.updateValueAndValidity();

    if (this.formGroup.valid) {
      let eol: Date | undefined = undefined;
      if (this.formGroup.value.eol) {
        eol = new Date(Date.parse(this.formGroup.value.eol));
      }

      this.save.emit({
        ...this.device,
        id: this.device.id,
        type: this.formGroup.value.type!,
        hostname: this.formGroup.value.hostname!,
        eol,
        ram: this.formGroup.value.ram!,
        model: this.formGroup.value.model!,
        manufacturer: this.formGroup.value.manufacturer!,
        storage: this.formGroup.value.storage!,
        cpu: {
          model: this.formGroup.value.cpuModel!,
          manufacturer: this.formGroup.value.cpuManufacturer!,
          cores: this.formGroup.value.cpuCores!,
          speed: this.formGroup.value.cpuSpeed!,
          threads: this.formGroup.value.cpuThreads!
        },
        os: {
          name: this.formGroup.value.operatingSystem!,
          version: this.formGroup.value.operatingSystemVersion!
        }
      });
    }
  }
}

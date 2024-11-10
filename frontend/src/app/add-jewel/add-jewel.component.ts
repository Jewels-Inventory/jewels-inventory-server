import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Device, Type } from '../api/models';
import QRCodeStyling from 'qr-code-styling';

enum ActiveTab {
  Code,
  Manual
}

export enum CpuManufacturer {
  Intel = 'Intel',
  AMD = 'AMD'
}

export function requiredWithCondition(condition: (control: AbstractControl) => boolean) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && condition(control)) {
      return {
        required: true
      };
    }

    return null;
  };
}

@Component({
  selector: 'app-add-jewel',
  templateUrl: './add-jewel.component.html',
  styleUrl: './add-jewel.component.scss'
})
export class AddJewelComponent {
  @Output() public onSubmitManual = new EventEmitter<Device>();
  @Output() public onSubmitCode = new EventEmitter<string>();

  @Input() public hasError = false;

  protected isOpen = false;

  protected tab = ActiveTab.Code;

  protected readonly ActiveTab = ActiveTab;

  protected token = crypto.randomUUID();
  protected readonly host = location.origin;

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
        CpuManufacturer.Intel,
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

  constructor() {
    this.token = crypto.randomUUID();
  }

  protected renderQrCode() {
    setTimeout(() => {
      const qrCode = new QRCodeStyling({
        dotsOptions: {
          color: '#28aef0',
          type: 'rounded'
        },
        backgroundOptions: {
          color: 'transparent'
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 0,
          hideBackgroundDots: false,
          imageSize: 1
        },
        width: 450,
        height: 450,
        margin: 0,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: 'H'
        },
        image: `${this.host}/static/qrlogo.svg`,
        data: JSON.stringify({
          host: this.host,
          token: this.token
        })
      });

      const element = document.getElementById('qrCode');
      if (element) {
        element.innerHTML = '';
        qrCode.append(element);
      }
    });
  }

  public open() {
    this.token = crypto.randomUUID();
    this.isOpen = true;
    this.formGroup.reset({ type: Type.Computer, cpuModel: 'Unbekannt', cpuManufacturer: CpuManufacturer.Intel });
    this.renderQrCode();
    this.tab = ActiveTab.Code;
  }

  public close() {
    this.isOpen = false;
  }

  protected switchToCode() {
    this.tab = ActiveTab.Code;
    this.renderQrCode();
  }

  protected saveDevice() {
    if (this.tab === ActiveTab.Code) {
      this.onSubmitCode.emit(this.token);
    } else if (this.tab === ActiveTab.Manual) {
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

        this.onSubmitManual.emit({
          id: crypto.randomUUID(),
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
}

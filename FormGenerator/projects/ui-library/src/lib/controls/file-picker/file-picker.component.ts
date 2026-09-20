import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { ControlNode } from '../../model/control-node';

@Component({
  selector: 'ui-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss'],
})
export class FilePickerComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  previewUrl: string | null = null;

  private get fc(): UntypedFormControl | null {
    return (this.control as UntypedFormControl) ?? null;
  }
  get accept(): string | null {
    return this.node.fileFormat ?? null;
  }
  get fileName(): string | null {
    const v = this.fc?.value;
    if (v instanceof File) return v.name;
    return typeof v === 'string' ? v : null;
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    this.fc?.setValue(file);

    this.previewUrl = null;
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => { this.previewUrl = reader.result as string; };
      reader.readAsDataURL(file);
    }
  }
}

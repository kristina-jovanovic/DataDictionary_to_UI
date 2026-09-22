import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { ControlNode } from '../../model/control-node';

@Component({
  selector: 'ui-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
})
export class CheckBoxComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  private get fc(): UntypedFormControl | null {
    return (this.control as UntypedFormControl) ?? null;
  }
  get isMulti(): boolean {
    return !!this.node.groupName;
  }
  get checked(): boolean {
    if (!this.fc) return false;
    if (this.isMulti) {
      return Array.isArray(this.fc.value) && this.fc.value.includes(this.node.optionValue);
    }
    return !!this.fc.value;
  }
  toggle(event: Event): void {
    if (!this.fc) return;
    const on = (event.target as HTMLInputElement).checked;
    if (this.isMulti) {
      const arr: unknown[] = Array.isArray(this.fc.value) ? [...this.fc.value] : [];
      const value = this.node.optionValue;
      const idx = arr.indexOf(value);
      if (on && idx < 0) arr.push(value);
      if (!on && idx >= 0) arr.splice(idx, 1);
      this.fc.setValue(arr);
    } else {
      this.fc.setValue(on);
    }
  }
}

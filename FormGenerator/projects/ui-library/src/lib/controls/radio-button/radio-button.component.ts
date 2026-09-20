import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { ControlNode } from '../../model/control-node';

@Component({
  selector: 'ui-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  private get fc(): UntypedFormControl | null {
    return (this.control as UntypedFormControl) ?? null;
  }
  get checked(): boolean {
    return !!this.fc && this.fc.value === this.node.optionValue;
  }
  select(): void {
    this.fc?.setValue(this.node.optionValue);
  }
}

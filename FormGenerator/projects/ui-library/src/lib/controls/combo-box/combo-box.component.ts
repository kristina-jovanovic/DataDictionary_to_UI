import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { ComboItem, ControlNode } from '../../model/control-node';

@Component({
  selector: 'ui-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss'],
})
export class ComboBoxComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  get fc(): UntypedFormControl | null {
    return (this.control as UntypedFormControl) ?? null;
  }
  get items(): ComboItem[] {
    return this.node.items ?? [];
  }
  get isMultiple(): boolean {
    return this.node.selectionMode === 'Multiple';
  }
}

import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ControlNode } from '../../model/control-node';

@Component({
  selector: 'ui-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class LabelComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  get text(): string {
    const v = this.control ? this.control.value : this.node.value;
    return v == null ? '' : String(v);
  }
}

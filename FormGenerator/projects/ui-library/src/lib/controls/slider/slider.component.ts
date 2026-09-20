import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { ControlNode } from '../../model/control-node';

@Component({
  selector: 'ui-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  get fc(): UntypedFormControl | null {
    return (this.control as UntypedFormControl) ?? null;
  }

  get min(): number { return Number(this.node.min); }
  get max(): number { return Number(this.node.max); }
  get step(): number { return this.node.step!; }
}

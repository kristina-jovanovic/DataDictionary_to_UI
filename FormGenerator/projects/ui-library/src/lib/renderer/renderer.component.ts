import { Component, Inject, Input, Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ControlNode } from '../model/control-node';
import { CONTROL_COMPONENTS, ControlComponentMap } from './control-registry';

@Component({
  selector: 'ui-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.scss'],
})
export class RendererComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  constructor(@Inject(CONTROL_COMPONENTS) private registry: ControlComponentMap) {}

  get component(): Type<unknown> | undefined {
    return this.registry[this.node.type];
  }
  get inputs(): Record<string, unknown> {
    return { node: this.node, control: this.control };
  }
}

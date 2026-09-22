import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ControlNode } from '../../model/control-node';

@Component({
  selector: 'ui-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  get min(): number { return Number(this.node.min); }
  get max(): number { return Number(this.node.max); }

  get value(): number {
    const raw = this.control ? this.control.value : this.node.value;
    const n = Number(raw);
    return Number.isFinite(n) ? n : this.min;
  }

  get percent(): number {
    const span = this.max - this.min;
    if (span <= 0) return 0;
    const r = (this.value - this.min) / span;
    return Math.max(0, Math.min(1, r)) * 100;
  }
}

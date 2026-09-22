import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { ControlNode } from '../../model/control-node';

@Component({
  selector: 'ui-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss'],
})
export class TextBoxComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  get fc(): UntypedFormControl | null {
    return (this.control as UntypedFormControl) ?? null;
  }
  get inputType(): string {
    const dt = this.node.dataType;
    return dt === 'Integer' || dt === 'Real' ? 'number' : 'text';
  }

  get isRegexPattern(): boolean {
    return !!this.node.pattern && this.node.pattern.startsWith('^');
  }

  get prefix(): string {
    const p = this.node.pattern;
    if (!p || this.isRegexPattern) return '';
    const i = p.indexOf('{n}');
    return i > 0 ? p.slice(0, i) : '';
  }

  get suffix(): string {
    const p = this.node.pattern;
    if (!p || this.isRegexPattern) return '';
    const i = p.indexOf('{n}');
    return i >= 0 ? p.slice(i + 3) : p;
  }
}

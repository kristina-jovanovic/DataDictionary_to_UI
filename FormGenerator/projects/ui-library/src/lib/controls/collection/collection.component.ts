import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { ControlNode } from '../../model/control-node';
import { MetaFormBuilder } from '../../forms/meta-form-builder.service';

@Component({
  selector: 'ui-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  constructor(private builder: MetaFormBuilder) {}

  private get array(): UntypedFormArray | null {
    return (this.control as UntypedFormArray) ?? null;
  }

  get template(): ControlNode | undefined {
    return this.node.template;
  }
  get items(): AbstractControl[] {
    return this.array?.controls ?? [];
  }

  get isTable(): boolean {
    const t = this.template;
    return !!t && t.type === 'Panel' && t.layout?.type === 'Grid';
  }
  get columns(): ControlNode[] {
    return this.template?.controls ?? [];
  }
  get rows(): UntypedFormGroup[] {
    return this.items as UntypedFormGroup[];
  }

  keyFor(node: ControlNode): string {
    return (node.type === 'RadioButton' || node.type === 'CheckBox') && node.groupName
      ? node.groupName
      : node.name;
  }
  cellControl(row: UntypedFormGroup, col: ControlNode): AbstractControl | null {
    return row.get(this.keyFor(col));
  }

  addRow(): void {
    const tpl = this.template;
    if (!tpl || !this.array) return;
    this.array.push(this.builder.build(tpl));
  }
  removeRow(index: number): void {
    this.array?.removeAt(index);
  }
}

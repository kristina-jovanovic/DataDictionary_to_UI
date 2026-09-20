import { Component, Input } from '@angular/core';
import { Alignment, ControlNode, LayoutNode } from '../model/control-node';
import { MetaSchemaService } from '../schema/meta-schema.service';

@Component({
  selector: 'ui-layout-editor',
  templateUrl: './layout-editor.component.html',
  styleUrls: ['./layout-editor.component.scss'],
})
export class LayoutEditorComponent {
  @Input() node!: ControlNode;

  readonly alignments: Alignment[] = ['Start', 'Center', 'End', 'Stretch'];

  constructor(private schema: MetaSchemaService) {}

  get layout(): LayoutNode {
    if (!this.node.layout) this.node.layout = this.schema.fillLayoutDefaults({ type: 'Flow' });
    return this.node.layout;
  }

  get tabGroupName(): string {
    return this.node.tabGroupName ?? '';
  }
  set tabGroupName(v: string) {
    this.node.tabGroupName = v.trim() ? v.trim() : undefined;
  }

  get type(): LayoutNode['type'] {
    return this.layout.type;
  }
  set type(v: LayoutNode['type']) {
    this.node.layout = this.schema.fillLayoutDefaults({ type: v, spacing: this.layout.spacing });
  }

  get orientation(): string { return this.layout.orientation!; }
  set orientation(v: string) { this.layout.orientation = v as 'horizontal' | 'vertical'; }

  get isWrapped(): boolean { return this.layout.isWrapped!; }
  set isWrapped(v: boolean) { this.layout.isWrapped = v; }

  get mainAlign(): Alignment { return this.layout.mainAxisAlignment!; }
  set mainAlign(v: Alignment) { this.layout.mainAxisAlignment = v; }

  get crossAlign(): Alignment { return this.layout.crossAxisAlignment!; }
  set crossAlign(v: Alignment) { this.layout.crossAxisAlignment = v; }

  get gap(): number { return this.layout.spacing!; }
  set gap(v: number) { this.layout.spacing = v; }

  get columnCount(): number { return this.layout.columns?.length ?? 2; }
  setColumnCount(n: number): void {
    const count = Math.max(1, Math.floor(n) || 1);
    this.layout.columns = Array.from({ length: count }, () => ({}));
  }
  get rowCount(): number { return this.layout.rows?.length ?? 0; }
  setRowCount(n: number): void {
    const count = Math.max(0, Math.floor(n) || 0);
    this.layout.rows = count > 0 ? Array.from({ length: count }, () => ({})) : undefined;
  }

  get showLines(): boolean { return this.layout.showGridLines!; }
  set showLines(v: boolean) { this.layout.showGridLines = v; }
}

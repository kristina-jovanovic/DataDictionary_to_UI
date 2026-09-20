import { Component, Input, Optional, SkipSelf } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { Alignment, ControlNode, GridColumn, GridRow } from '../../model/control-node';
import { EditModeService } from '../../edit/edit-mode.service';

function toTrackSize(w: string | number | undefined): string {
  if (w === undefined || w === '') return '';
  if (typeof w === 'number') return w + 'px';
  const s = w.trim();
  if (/^\d*\.?\d+f$/.test(s)) return s.slice(0, -1) + 'fr';
  if (/^\d*\.?\d+$/.test(s)) return s + 'px';
  return s;
}
function track(size: string | number | undefined, min: number | undefined, max: number | undefined): string {
  const base = toTrackSize(size) || '1fr';
  if (min != null || max != null) {
    const mn = min != null ? min + 'px' : 'auto';
    const mx = max != null ? max + 'px' : base;
    return `minmax(${mn}, ${mx})`;
  }
  return base;
}

type RenderItem =
  | { kind: 'single'; node: ControlNode }
  | { kind: 'tabs'; group: string; panels: ControlNode[] };

@Component({
  selector: 'ui-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;
  @Input() hideTitle = false;

  menuOpen = false;
  menuX = 0;
  menuY = 0;
  activeTab: Record<string, number> = {};

  constructor(
    @Optional() @SkipSelf() private parent: PanelComponent | null,
    public editMode: EditModeService,
  ) {}

  get isRoot(): boolean {
    return !this.parent;
  }
  get controls(): ControlNode[] {
    return this.node.controls ?? [];
  }

  get renderItems(): RenderItem[] {
    const kids = this.controls;
    const items: RenderItem[] = [];
    const done = new Set<string>();
    for (const child of kids) {
      const group = child.type === 'Panel' ? child.tabGroupName : undefined;
      if (group) {
        const panels = kids.filter(c => c.type === 'Panel' && c.tabGroupName === group);
        if (panels.length >= 2) {
          if (!done.has(group)) {
            done.add(group);
            items.push({ kind: 'tabs', group, panels });
          }
          continue;
        }
      }
      items.push({ kind: 'single', node: child });
    }
    return items;
  }

  activeIndex(group: string): number {
    return this.activeTab[group] ?? 0;
  }
  selectTab(group: string, index: number): void {
    this.activeTab[group] = index;
  }
  trackItem(_index: number, item: RenderItem): string {
    return item.kind === 'tabs' ? 'tabs:' + item.group : 'single:' + item.node.id;
  }
  get isGrid(): boolean {
    return this.node.layout?.type === 'Grid';
  }
  get showLines(): boolean {
    return !!this.node.layout?.showGridLines;
  }

  private get gap(): string {
    return `${this.node.layout!.spacing}px`;
  }

  get flowStyle(): Record<string, string> {
    const l = this.node.layout!;
    const align: Record<Alignment, string> = { Start: 'flex-start', Center: 'center', End: 'flex-end', Stretch: 'stretch' };
    const justify: Record<Alignment, string> = { Start: 'flex-start', Center: 'center', End: 'flex-end', Stretch: 'flex-start' };
    return {
      'flex-direction': l.orientation === 'horizontal' ? 'row' : 'column',
      'flex-wrap': l.isWrapped ? 'wrap' : 'nowrap',
      'justify-content': justify[l.mainAxisAlignment!],
      'align-items': align[l.crossAxisAlignment!],
      'gap': this.gap,
    };
  }
  get isMainStretch(): boolean {
    return this.node.layout!.mainAxisAlignment === 'Stretch';
  }

  get gridStyle(): Record<string, string> {
    const l = this.node.layout!;
    const style: Record<string, string> = { 'gap': this.gap };
    const cols: GridColumn[] = l?.columns ?? [];
    style['grid-template-columns'] = cols.length
      ? cols.map(c => track(c.width, c.minWidth, c.maxWidth)).join(' ')
      : 'repeat(2, 1fr)';
    const rows: GridRow[] = l?.rows ?? [];
    if (rows.length) {
      style['grid-template-rows'] = rows.map(r => track(r.height, r.minHeight, r.maxHeight)).join(' ');
    }
    return style;
  }

  onContextMenu(event: MouseEvent): void {
    if (!this.editMode.enabled) return;
    event.preventDefault();
    event.stopPropagation();
    this.menuX = event.clientX;
    this.menuY = event.clientY;
    this.menuOpen = true;
  }
  closeMenu(): void {
    this.menuOpen = false;
  }

  private get group(): UntypedFormGroup | null {
    return (this.control as UntypedFormGroup) ?? null;
  }
  keyFor(child: ControlNode): string {
    return (child.type === 'RadioButton' || child.type === 'CheckBox') && child.groupName
      ? child.groupName
      : child.name;
  }
  controlFor(child: ControlNode): AbstractControl | null {
    return this.group?.get(this.keyFor(child)) ?? null;
  }
  trackById(_index: number, child: ControlNode): number {
    return child.id;
  }
}

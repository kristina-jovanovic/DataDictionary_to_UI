import { ExprNode } from '../expression/expression-evaluator';

export type Alignment = 'Start' | 'Center' | 'End' | 'Stretch';

export interface LayoutNode {
  type: 'Flow' | 'Grid' | 'Anchor' | 'Explicit';
  spacing?: number;
  showGridLines?: boolean;

  orientation?: 'horizontal' | 'vertical';
  isWrapped?: boolean;
  mainAxisAlignment?: Alignment;
  crossAxisAlignment?: Alignment;

  columns?: GridColumn[];
  rows?: GridRow[];

  isLastChildFill?: boolean;
}

export interface GridColumn {
  width?: string | number;
  minWidth?: number;
  maxWidth?: number;
}

export interface GridRow {
  height?: string | number;
  minHeight?: number;
  maxHeight?: number;
}

export interface ComboItem {
  id?: number;
  value?: string;
  label?: string;
}

export interface ControlNode {
  id: number;
  name: string;
  type: string;

  title?: string;
  tabGroupName?: string;
  label?: string;
  dataType?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  pattern?: string;
  format?: string;

  mode?: string;
  groupName?: string;
  optionValue?: string;

  items?: ComboItem[];
  selectionMode?: string;
  isEditable?: boolean;
  placeholder?: string;

  fileFormat?: string;

  defaultValue?: unknown;
  value?: unknown;
  min?: number | string;
  step?: number;
  max?: number | string;

  restrictedValue?: ExprNode;
  computedValue?: ExprNode;

  layout?: LayoutNode;
  controls?: ControlNode[];
  template?: ControlNode;

  [key: string]: unknown;
}

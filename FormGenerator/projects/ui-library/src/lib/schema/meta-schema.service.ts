import { Injectable } from '@angular/core';
import Ajv, { ValidateFunction } from 'ajv';
import { ControlNode, LayoutNode } from '../model/control-node';

import layout from './layout.schema.json';
import expression from './expression.schema.json';
import dataControl from './data-control.schema.json';
import contentControl from './content-control.schema.json';
import control from './control.schema.json';
import panel from './controls/panel.schema.json';
import textBox from './controls/text-box.schema.json';
import dateTimePicker from './controls/date-time-picker.schema.json';
import choice from './controls/choice.schema.json';
import comboBox from './controls/combo-box.schema.json';
import collection from './controls/collection.schema.json';
import filePicker from './controls/file-picker.schema.json';
import slider from './controls/slider.schema.json';
import label from './controls/label.schema.json';
import progressBar from './controls/progress-bar.schema.json';

export const ROOT_SCHEMA_ID = 'https://ui.local/schema/control.schema.json';

export interface NormalizeResult {
  node: ControlNode;
  valid: boolean;
  errors: string[];
}

export const LAYOUT_SCHEMA_ID = 'https://ui.local/schema/layout.schema.json';

@Injectable({ providedIn: 'root' })
export class MetaSchemaService {
  private readonly validate: ValidateFunction;
  private readonly validateLayout: ValidateFunction;

  constructor() {
    const ajv = new Ajv({ useDefaults: true, allErrors: true, strict: false });
    ajv.addSchema([
      layout,
      expression,
      dataControl,
      contentControl,
      control,
      panel,
      textBox,
      dateTimePicker,
      choice,
      comboBox,
      collection,
      filePicker,
      slider,
      label,
      progressBar,
    ] as unknown as import('ajv').AnySchema[]);
    this.validate = ajv.getSchema(ROOT_SCHEMA_ID) as ValidateFunction;
    this.validateLayout = ajv.getSchema(LAYOUT_SCHEMA_ID) as ValidateFunction;
  }

  fillLayoutDefaults(partial: Partial<LayoutNode>): LayoutNode {
    const result = structuredClone(partial) as LayoutNode;
    if (!result.type) result.type = 'Flow';
    this.validateLayout(result);
    return result;
  }

  normalize(raw: unknown): NormalizeResult {
    const node = structuredClone(raw) as ControlNode;
    const valid = this.validate(node) as boolean;
    const errors = (this.validate.errors ?? [])
      .filter((e) => e.keyword !== 'if')
      .map((e) => {
        const where = describeControl(node, e.instancePath);
        return `${where}${e.instancePath || '/'} ${e.message ?? ''}`.trim();
      });
    return { node, valid, errors };
  }
}

function describeControl(root: unknown, instancePath: string): string {
  const isControl = (x: unknown): x is Record<string, unknown> =>
    !!x && typeof x === 'object' && !Array.isArray(x) && ('type' in x || 'name' in x);

  const segments = instancePath
    .split('/')
    .slice(1)
    .map((s) => s.replace(/~1/g, '/').replace(/~0/g, '~'));

  let current: unknown = root;
  let control: Record<string, unknown> | null = isControl(root) ? root : null;

  for (const seg of segments) {
    if (current == null || typeof current !== 'object') break;
    current = (current as Record<string, unknown>)[seg];
    if (isControl(current)) control = current;
  }

  if (!control) return '';
  const type = control['type'] != null ? String(control['type']) : '';
  const name = control['name'] != null ? `"${String(control['name'])}"` : '';
  const label = [type, name].filter(Boolean).join(', ');
  return label ? `[${label}] ` : '';
}

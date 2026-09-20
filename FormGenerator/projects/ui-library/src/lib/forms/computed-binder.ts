import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ControlNode } from '../model/control-node';
import { evaluate } from '../expression/expression-evaluator';
import { createFormResolver } from '../expression/form-resolver';

function keyFor(node: ControlNode): string {
  return (node.type === 'RadioButton' || node.type === 'CheckBox') && node.groupName
    ? node.groupName
    : node.name;
}

function recomputeNode(node: ControlNode, control: AbstractControl): void {
  const expr = node.computedValue;
  if (!expr) return;
  try {
    const { resolve, resolveValue } = createFormResolver(control);
    const value = evaluate(expr, resolve, resolveValue);
    const next = typeof value === 'number' && Number.isNaN(value) ? null : value;
    if (control.value !== next) {
      control.setValue(next, { emitEvent: false });
    }
  } catch (err) {
    console.warn('[computed] Greška u izrazu za polje', node.name, err);
  }
}

function walk(node: ControlNode, control: AbstractControl | null): void {
  if (!control) return;
  recomputeNode(node, control);

  if (node.type === 'Panel') {
    const group = control as UntypedFormGroup;
    for (const child of node.controls ?? []) {
      walk(child, group.get(keyFor(child)));
    }
  } else if (node.type === 'Collection' && node.template) {
    const array = control as UntypedFormArray;
    for (const item of array.controls) {
      walk(node.template, item);
    }
  }
}

export function bindComputed(node: ControlNode, rootControl: AbstractControl): Subscription {
  const sub = new Subscription();
  const recomputeAll = (): void => walk(node, rootControl);
  recomputeAll();
  sub.add(rootControl.valueChanges.subscribe(recomputeAll));
  return sub;
}

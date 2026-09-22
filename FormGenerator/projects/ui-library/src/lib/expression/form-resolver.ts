import { AbstractControl, UntypedFormArray } from '@angular/forms';
import { Resolve, ResolveValue } from './expression-evaluator';

export type SpecialTokens = Record<string, () => unknown>;

export const DEFAULT_SPECIAL_TOKENS: SpecialTokens = {
  'CURRENT_DATE.Year': () => new Date().getFullYear(),
  'CURRENT_DATE': () => new Date(),
  'today': () => new Date().getFullYear(),
};

export interface FormResolvers {
  resolve: Resolve;
  resolveValue: ResolveValue;
}

function findByName(scope: AbstractControl, name: string): AbstractControl | null {
  let node: AbstractControl | null = scope.parent ?? scope;
  while (node) {
    const found = node.get(name);
    if (found) return found;
    node = node.parent;
  }
  return null;
}

function isAncestor(candidate: AbstractControl, node: AbstractControl): boolean {
  let p: AbstractControl | null = node.parent;
  while (p) {
    if (p === candidate) return true;
    p = p.parent;
  }
  return false;
}

function valueByName(row: AbstractControl, field: string): unknown {
  const control = row.get(field);
  return control ? control.value : undefined;
}

export function createFormResolver(
  scope: AbstractControl,
  special: SpecialTokens = DEFAULT_SPECIAL_TOKENS,
): FormResolvers {
  const resolve: Resolve = (token: string) => {
    if (token in special) return special[token]();

    const parts = token.split('.');
    const field = parts[parts.length - 1];

    if (parts.length > 1) {
      const head = findByName(scope, parts[0]);
      const rest = parts.slice(1).join('.');

      if (head instanceof UntypedFormArray && !isAncestor(head, scope)) {
        return head.controls.map(row => valueByName(row, rest));
      }
      if (head && !(head instanceof UntypedFormArray)) {
        const inner = head.get(rest);
        if (inner) return inner.value;
      }
    }

    const control = findByName(scope, field);
    return control ? control.value : undefined;
  };

  const resolveValue: ResolveValue = (value: unknown) =>
    typeof value === 'string' && value in special ? special[value]() : value;

  return { resolve, resolveValue };
}

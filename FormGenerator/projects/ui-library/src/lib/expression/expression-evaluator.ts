export type Resolve = (targetName: string) => unknown;
export type ResolveValue = (value: unknown) => unknown;

export interface ExprNode {
  group?: 'AND' | 'OR';
  rules?: ExprNode[];
  operator?: string;
  targetName?: string;
  value?: unknown;
}

function num(x: unknown): number {
  return typeof x === 'number' ? x : parseFloat(String(x));
}
function isNum(x: unknown): boolean {
  return x !== null && x !== undefined && x !== '' && !Number.isNaN(num(x));
}
function num0(x: unknown): number {
  return isNum(x) ? num(x) : 0;
}
function likeToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.');
  return new RegExp('^' + escaped + '$');
}

function applyOp(op: string, xs: unknown[]): unknown {
  switch (op) {
    case '>':  return num(xs[0]) >  num(xs[1]);
    case '>=': return num(xs[0]) >= num(xs[1]);
    case '<':  return num(xs[0]) <  num(xs[1]);
    case '<=': return num(xs[0]) <= num(xs[1]);
    case '=':  return xs[0] == xs[1];
    case '!=': return xs[0] != xs[1];
    case '+':  return num0(xs[0]) + num0(xs[1]);
    case '-':  return num0(xs[0]) - num0(xs[1]);
    case '*':  return num(xs[0]) * num(xs[1]);
    case '/':  return num(xs[0]) / num(xs[1]);
    case 'AND': return xs.every(Boolean);
    case 'OR':  return xs.some(Boolean);
    case 'NOT': return !xs[0];
    case 'SUM': return xs.flat().filter(isNum).reduce<number>((a, b) => a + num(b), 0);
    case 'MIN': { const n = xs.flat().filter(isNum).map(num); return n.length ? Math.min(...n) : null; }
    case 'MAX': { const n = xs.flat().filter(isNum).map(num); return n.length ? Math.max(...n) : null; }
    case 'AVG': { const n = xs.flat().filter(isNum).map(num); return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null; }
    case 'COUNT': return xs.flat().filter(isNum).length;
    case 'IN':     return xs.slice(1).includes(xs[0]);
    case 'NOT_IN': return !xs.slice(1).includes(xs[0]);
    case 'LIKE':   return likeToRegex(String(xs[1])).test(String(xs[0]));
    default: throw new Error('Nepoznat operator: ' + op);
  }
}

const identity: ResolveValue = v => v;

export function evaluate(node: ExprNode, resolve: Resolve, resolveValue: ResolveValue = identity): unknown {
  if (node.rules) {
    const res = node.rules.map(r => evaluate(r, resolve, resolveValue));
    if (node.group === 'OR') return res.some(Boolean);
    if (node.group === 'AND') return res.every(Boolean);
    return res.length === 1 ? res[0] : res.every(Boolean);
  }
  if (node.operator) {
    const xs = Array.isArray(node.value)
      ? (node.value as ExprNode[]).map(v => evaluate(v, resolve, resolveValue))
      : [resolve(node.targetName ?? ''), resolveValue(node.value)];
    return applyOp(node.operator, xs);
  }
  if (node.targetName != null) {
    return resolve(node.targetName);
  }
  return resolveValue(node.value);
}

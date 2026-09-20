import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { evaluate, ExprNode } from '../expression/expression-evaluator';
import { createFormResolver } from '../expression/form-resolver';

export function restrictedValidator(expr: ExprNode): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { resolve, resolveValue } = createFormResolver(control);
    return evaluate(expr, resolve, resolveValue) ? null : { restricted: true };
  };
}

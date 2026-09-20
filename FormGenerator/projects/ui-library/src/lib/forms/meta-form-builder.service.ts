import { Injectable } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ControlNode } from '../model/control-node';
import { restrictedValidator } from './expression-validators';

@Injectable({ providedIn: 'root' })
export class MetaFormBuilder {
  build(node: ControlNode): AbstractControl {
    return this.buildNode(node);
  }

  private buildNode(node: ControlNode): AbstractControl {
    if (node.type === 'Panel') return this.buildGroup(node);
    if (node.type === 'Collection') return this.buildArray(node);
    return this.buildControl(node);
  }

  private buildGroup(panel: ControlNode): UntypedFormGroup {
    const group = new UntypedFormGroup({});
    const controls = panel.controls ?? [];
    const handledGroups = new Set<string>();

    for (const child of controls) {
      const groupName = child.groupName;

      if ((child.type === 'RadioButton' || child.type === 'CheckBox') && groupName) {
        if (handledGroups.has(groupName)) continue;
        handledGroups.add(groupName);
        const members = controls.filter(c => c.groupName === groupName);
        const isMulti = members[0].type === 'CheckBox';
        const validators = members.some(m => m.isRequired) ? [Validators.required] : [];
        group.addControl(groupName, new UntypedFormControl(isMulti ? [] : null, validators));
      } else if (child.type === 'Panel') {
        group.addControl(child.name, this.buildGroup(child));
      } else if (child.type === 'Collection') {
        group.addControl(child.name, this.buildArray(child));
      } else {
        group.addControl(child.name, this.buildControl(child));
      }
    }
    return group;
  }

  private buildArray(collection: ControlNode): UntypedFormArray {
    const array = new UntypedFormArray([]);
    if (collection.template) {
      array.push(this.buildNode(collection.template));
    }
    return array;
  }

  private buildControl(node: ControlNode): UntypedFormControl {
    const validators: ValidatorFn[] = [];
    if (node.isRequired) validators.push(Validators.required);
    if (node.pattern && node.pattern.startsWith('^')) validators.push(Validators.pattern(node.pattern));
    if (node.restrictedValue) validators.push(restrictedValidator(node.restrictedValue));
    const initial = node.defaultValue ?? node.value ?? null;
    return new UntypedFormControl(initial, validators);
  }
}

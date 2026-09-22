import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ControlNode } from '../model/control-node';
import { MetaFormBuilder } from './meta-form-builder.service';
import { bindComputed } from './computed-binder';
import { MetaSchemaService } from '../schema/meta-schema.service';
import { saveJson } from '../io/save-json';

@Component({
  selector: 'ui-form',
  template: `
    <ui-renderer *ngIf="valid && resolved" [node]="resolved" [control]="form"></ui-renderer>

    <div class="ui-form-errors" *ngIf="!valid">
      <div class="ui-form-errors_head">Метамодел није валидан. Укупан број грешака {{ errors.length }}:</div>
      <ul class="ui-form-errors_list">
        <li *ngFor="let e of errors">{{ e }}</li>
      </ul>
    </div>
  `,
  styles: [`
    .ui-form-errors {
      border: 1px solid #e0b4b4;
      background: #fff6f6;
      color: #9f3a38;
      border-radius: 6px;
      padding: .75rem 1rem;
      font-family: system-ui, sans-serif;
    }
    .ui-form-errors_head { font-weight: 700; margin-bottom: .5rem; }
    .ui-form-errors_list { margin: 0; padding-left: 1.2rem; }
    .ui-form-errors_list li { margin: .45rem 0; font-family: ui-monospace, monospace; font-size: .9rem; line-height: 1.3; }
  `],
})
export class UiFormComponent implements OnChanges, OnDestroy {
  @Input() node!: ControlNode;
  @Output() formReady = new EventEmitter<AbstractControl>();
  @Output() schemaErrors = new EventEmitter<string[]>();

  resolved: ControlNode | null = null;
  form: AbstractControl | null = null;
  valid = true;
  errors: string[] = [];
  private computedSub?: Subscription;

  constructor(
    private builder: MetaFormBuilder,
    private schema: MetaSchemaService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['node'] && this.node) {
      this.computedSub?.unsubscribe();

      const { node, valid, errors } = this.schema.normalize(this.node);
      this.valid = valid;
      this.errors = errors;
      this.schemaErrors.emit(errors);

      if (valid) {
        this.resolved = node;
        this.form = this.builder.build(this.resolved);
        this.computedSub = bindComputed(this.resolved, this.form);
        this.formReady.emit(this.form);
      } else {
        this.resolved = null;
        this.form = null;
      }
    }
  }

  save(fileName = 'metamodel.json'): Promise<boolean> {
    if (!this.resolved) return Promise.resolve(false);
    return saveJson(this.resolved, fileName);
  }

  ngOnDestroy(): void {
    this.computedSub?.unsubscribe();
  }
}

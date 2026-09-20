import { Component, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ControlNode, EditModeService, UiFormComponent } from 'ui-library';
import ISPITNA from './ispitna-prijava.json';
import POPIS from './popis-inventara.json';
import REZERVACIJA from './rezervacija-avio-karata.json';
import POPIS_GRESKE from './popis-inventara-greske.json';
import GENERISANO from './generated.json';

@Component({
  selector: 'app-root',
  template: `
    <main style="width:100% ;max-width: 930px; margin: 1.5rem auto; font-family: system-ui, sans-serif;">
      <div style="display: flex; gap: .5rem; margin-bottom: 1rem;">
        <button type="button" (click)="edit.toggle()">
          {{ edit.enabled ? '✓ Измени' : '✎ Измени' }}
        </button>
        <button type="button" (click)="save()">💾 Сачувај</button>
      </div>

      <ui-form #ui [node]="model" (formReady)="form = $event"></ui-form>
    </main>
  `,
})
export class AppComponent {
  ispitna = ISPITNA as unknown as ControlNode;
  popis = POPIS as unknown as ControlNode;
  rezervacija = REZERVACIJA as unknown as ControlNode;
  popisGreske = POPIS_GRESKE as unknown as ControlNode;
  generisano = GENERISANO as unknown as ControlNode;
  model: ControlNode = this.generisano;
  form?: AbstractControl;

  @ViewChild('ui') ui!: UiFormComponent;

  constructor(public edit: EditModeService) {}

  select(m: ControlNode): void {
    this.model = m;
  }

  async save(): Promise<void> {
    const ok = await this.ui.save(`${this.model.name}.json`);
    if (!ok) console.log('Čuvanje otkazano ili nema validnog modela.');
  }
}

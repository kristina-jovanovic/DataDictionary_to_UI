import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { ControlNode } from '../model/control-node';
import { UiLibraryModule } from '../ui-library.module';
import { UiFormComponent } from './ui-form.component';

@Component({
  template: `<ui-form [node]="model" (formReady)="form = $event"></ui-form>`,
})
class HostComponent {
  @ViewChild(UiFormComponent) ui!: UiFormComponent;
  form?: AbstractControl;
  model: ControlNode = {
    id: 1,
    name: 'Root',
    type: 'Panel',
    controls: [
      { id: 2, name: 'A', type: 'TextBox', dataType: 'Real', isRequired: true },
      { id: 3, name: 'B', type: 'TextBox', dataType: 'Real', isRequired: true },
      {
        id: 4,
        name: 'C',
        type: 'TextBox',
        dataType: 'Real',
        isReadOnly: true,
        computedValue: {
          rules: [{ operator: 'SUM', value: [{ targetName: 'A' }, { targetName: 'B' }] }],
        },
      },
    ],
  } as ControlNode;
}

describe('UiFormComponent (render + schema pipeline)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [UiLibraryModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('normalize popunjava layout default-e (Flow, spacing 8)', () => {
    const resolved = host.ui.resolved!;
    expect(resolved.layout?.type).toBe('Flow');
    expect(resolved.layout?.spacing).toBe(8);
    expect(host.form).toBeTruthy();
  });

  it('originalni (sirovi) model se ne menja', () => {
    expect(host.model.layout).toBeUndefined();
  });

  it('computed SUM se azurira kroz formu', () => {
    const g = host.form as UntypedFormGroup;
    g.get('A')!.setValue(2);
    g.get('B')!.setValue(3);
    fixture.detectChanges();
    expect(g.get('C')!.value).toBe(5);
  });

  it('renderuje input polja u DOM', () => {
    const inputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(3);
  });
});

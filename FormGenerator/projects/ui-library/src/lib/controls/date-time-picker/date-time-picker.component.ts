import { Component, Input, Optional } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { ControlNode } from '../../model/control-node';
import { CollectionComponent } from '../collection/collection.component';

function isoToFormat(iso: string, fmt: string): string {
  if (!iso) return '';
  let datePart = '';
  let timePart = '';
  if (iso.includes('T')) {
    [datePart, timePart] = iso.split('T');
  } else if (iso.includes(':')) {
    timePart = iso;
  } else {
    datePart = iso;
  }
  const [y = '', m = '', d = ''] = datePart.split('-');
  const [H = '', min = ''] = timePart.split(':');
  return fmt
    .replace(/yyyy/g, y)
    .replace(/yy/g, y.slice(-2))
    .replace(/MM/g, m)
    .replace(/dd/g, d)
    .replace(/HH/g, H)
    .replace(/mm/g, min);
}

@Component({
  selector: 'ui-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
})
export class DateTimePickerComponent {
  @Input() node!: ControlNode;
  @Input() control: AbstractControl | null = null;

  constructor(@Optional() private collection: CollectionComponent | null) {}

  get inCollection(): boolean {
    return !!this.collection;
  }

  get fc(): UntypedFormControl | null {
    return (this.control as UntypedFormControl) ?? null;
  }

  get useFormat(): boolean {
    return !!this.node.format;
  }

  private get hasDay(): boolean { return !!this.node.format && /d/.test(this.node.format); }
  private get hasMonth(): boolean { return !!this.node.format && /M/.test(this.node.format); }
  private get hasYear(): boolean { return !!this.node.format && /y/i.test(this.node.format); }
  private get hasTime(): boolean { return !!this.node.format && /[Hhms]/.test(this.node.format); }

  get isYearOnly(): boolean {
    return this.hasYear && !this.hasMonth && !this.hasDay && !this.hasTime;
  }

  get pickerType(): string {
    if (this.hasTime && (this.hasDay || this.hasMonth || this.hasYear)) return 'datetime-local';
    if (this.hasTime) return 'time';
    if (this.hasMonth && !this.hasDay) return 'month';
    return 'date';
  }
  get nativeType(): string {
    switch (this.node.mode) {
      case 'Time': return 'time';
      case 'DateTime': return 'datetime-local';
      default: return 'date';
    }
  }

  get isoValue(): string {
    return typeof this.fc?.value === 'string' ? this.fc.value : '';
  }
  get displayValue(): string {
    return this.node.format ? isoToFormat(this.isoValue, this.node.format) : this.isoValue;
  }

  onPick(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.fc?.setValue(value || null);
  }
  openPicker(el: HTMLInputElement): void {
    const withPicker = el as HTMLInputElement & { showPicker?: () => void };
    if (typeof withPicker.showPicker === 'function') withPicker.showPicker();
    else el.focus();
  }
}

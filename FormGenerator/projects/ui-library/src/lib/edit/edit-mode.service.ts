import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EditModeService {
  enabled = false;

  toggle(): void {
    this.enabled = !this.enabled;
  }
}

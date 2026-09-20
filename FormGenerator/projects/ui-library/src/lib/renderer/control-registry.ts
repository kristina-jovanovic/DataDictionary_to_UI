import { InjectionToken, Type } from '@angular/core';

export type ControlComponentMap = Record<string, Type<unknown>>;

export const CONTROL_COMPONENTS = new InjectionToken<ControlComponentMap>('CONTROL_COMPONENTS');

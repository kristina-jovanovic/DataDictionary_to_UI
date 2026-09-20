import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CONTROL_COMPONENTS, ControlComponentMap } from './renderer/control-registry';
import { RendererComponent } from './renderer/renderer.component';
import { UiFormComponent } from './forms/ui-form.component';
import { PanelComponent } from './controls/panel/panel.component';
import { TextBoxComponent } from './controls/text-box/text-box.component';
import { DateTimePickerComponent } from './controls/date-time-picker/date-time-picker.component';
import { RadioButtonComponent } from './controls/radio-button/radio-button.component';
import { CheckBoxComponent } from './controls/check-box/check-box.component';
import { ComboBoxComponent } from './controls/combo-box/combo-box.component';
import { CollectionComponent } from './controls/collection/collection.component';
import { FilePickerComponent } from './controls/file-picker/file-picker.component';
import { SliderComponent } from './controls/slider/slider.component';
import { LabelComponent } from './controls/label/label.component';
import { ProgressBarComponent } from './controls/progress-bar/progress-bar.component';
import { LayoutEditorComponent } from './edit/layout-editor.component';

export const DEFAULT_CONTROLS: ControlComponentMap = {
  Panel: PanelComponent,
  TextBox: TextBoxComponent,
  DateTimePicker: DateTimePickerComponent,
  RadioButton: RadioButtonComponent,
  CheckBox: CheckBoxComponent,
  ComboBox: ComboBoxComponent,
  Collection: CollectionComponent,
  FilePicker: FilePickerComponent,
  Slider: SliderComponent,
  Label: LabelComponent,
  ProgressBar: ProgressBarComponent,
};

@NgModule({
  declarations: [
    RendererComponent,
    UiFormComponent,
    PanelComponent,
    TextBoxComponent,
    DateTimePickerComponent,
    RadioButtonComponent,
    CheckBoxComponent,
    ComboBoxComponent,
    CollectionComponent,
    FilePickerComponent,
    SliderComponent,
    LabelComponent,
    ProgressBarComponent,
    LayoutEditorComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [RendererComponent, UiFormComponent],
})
export class UiLibraryModule {
  static forRoot(extra: ControlComponentMap = {}): ModuleWithProviders<UiLibraryModule> {
    return {
      ngModule: UiLibraryModule,
      providers: [
        { provide: CONTROL_COMPONENTS, useValue: { ...DEFAULT_CONTROLS, ...extra } },
      ],
    };
  }
}

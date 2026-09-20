import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { UiLibraryModule } from 'ui-library';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UiLibraryModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

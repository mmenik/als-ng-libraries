import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';

import { MatInputModule, MatCardModule, MatSlideToggleModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyboardModule } from '@als/keyboard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatCardModule,
    MatSlideToggleModule,
    MatIconModule,
    KeyboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

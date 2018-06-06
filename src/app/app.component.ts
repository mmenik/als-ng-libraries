import { Component, OnInit, ElementRef } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'als-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public form: FormGroup;
  theme: string;
  darkTheme: boolean;

  constructor(private readonly fb: FormBuilder,
    private readonly element: ElementRef,
    private readonly overlayContainer: OverlayContainer) { }

  ngOnInit() {
    this.form = this.fb.group({
      text1: '',
      text2: '',
      text3: ''
    });
  }


  toggleDarkTheme(toggle: MatSlideToggleChange) {
    if (toggle.checked) {
      this.element.nativeElement.classList.add('dark-theme');
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
      this.theme = 'dark-theme';
    } else {
      this.element.nativeElement.classList.remove('dark-theme');
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
      this.theme = undefined;
    }
  }
}

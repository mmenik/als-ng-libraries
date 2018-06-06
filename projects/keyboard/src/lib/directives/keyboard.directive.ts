import { Directive, ElementRef, HostListener, Input, Optional, Self } from '@angular/core';
import { KeyboardService } from '../services/keyboard.service';
import { KeyboardRef } from '../classes/keyboard-ref.class';
import { KeyboardComponent } from '../components/keyboard/keyboard.component';
import { NgControl } from '@angular/forms';

/**
 *KeyboardDirective class.
 *
 * @export
 * @class KeyboardDirective
 */
@Directive({
  selector: '[alsKeyboard]'
})
export class KeyboardDirective {
  private keyboardRef: KeyboardRef<KeyboardComponent>;

  @Input() keyboardLayout: string;
  @Input() keyboardTheme: string;
  @Input() keyboardPosition: string;
  @Input() keyboardEnabled: string;

  /**
   *Creates an instance of KeyboardDirective.
   * @param {ElementRef} elementRef
   * @param {KeyboardService} keyboardService
   * @param {NgControl} [control]
   * @memberof KeyboardDirective
   */
  constructor(private elementRef: ElementRef,
    private readonly keyboardService: KeyboardService,
    @Optional() @Self() private control?: NgControl) { }

  @HostListener('focus', ['$event'])
  private showKeyboard() {
    if (!this.keyboardEnabled || this.keyboardEnabled === 'true') {
      this.keyboardRef = this.keyboardService.open(this.keyboardLayout, this.keyboardTheme, this.keyboardPosition);
      this.keyboardRef.instance.setInput(this.elementRef);
      this.keyboardRef.instance.attachControl(this.control.control);
    }
  }

  @HostListener('blur', ['$event'])
  private hideKeyboard() {
    if (this.keyboardRef) {
      this.keyboardRef.dismiss();
    }
  }
}

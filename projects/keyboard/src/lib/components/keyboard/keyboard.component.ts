import { Component, OnInit, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { KeyPressInterface } from '../../interfaces/key-press.interface';
import { KeyboardLayout } from '../../keyboard-layout';
import { KeyService } from '../../services/key.service';
import { KeyboardKeyComponent } from '../keyboard-key/keyboard-key.component';
import { KeyboardKey } from '../../enums/keyboard-key.enum';

/**
 *KeyboardComponent class.
 *
 * @export
 * @class KeyboardComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'als-keyboard-component',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {
  private control: AbstractControl;
  private input: ElementRef;
  private layout: KeyboardLayout;
  public darkTheme: boolean;

  private lock: boolean;
  private shift: boolean;

  @ViewChildren(KeyboardKeyComponent)
  private keys: QueryList<KeyboardKeyComponent>;

  get keyboardLayout() {
    return this.layout;
  }

  set keyboardLayout(value: KeyboardLayout) {
    this.layout = value;
  }

  set keyboardTheme(value: string) {
    this.darkTheme = value === 'dark-theme';
  }

  /**
   *Creates an instance of KeyboardComponent.
   * @param {KeyService} keyService
   * @memberof KeyboardComponent
   */
  constructor(private readonly keyService: KeyService) { }

  ngOnInit() {
    this.lock = false;
    this.shift = false;
    this.keyService.toggleCapsLock(this.lock);
    this.keyService.shiftPressed(this.shift);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log('KeyDown:', event.key);
    this.keys.filter((key: KeyboardKeyComponent) => (key.value === event.key ||
      (key.value === KeyboardKey.Space && event.key === ' ')))
      .forEach((key: KeyboardKeyComponent) => {
        key.pressed = true;
        switch (key.value) {
          case KeyboardKey.Enter:
            this.pressEnter();
            break;
          case KeyboardKey.Shift:
            this.toggleShift();
            break;
          case KeyboardKey.CapsLock:
            this.toggleCapsLock();
            break;
          default:
            break;
        }
      });
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.keys.filter((key: KeyboardKeyComponent) => (key.value === event.key ||
      (key.value === KeyboardKey.Space && event.key === ' ')))
      .forEach((key: KeyboardKeyComponent) => {
        key.pressed = false;
      });
  }

  attachControl(control: AbstractControl) {
    this.control = control;
  }

  setInput(input: ElementRef) {
    this.input = input;
  }

  onKeyPress(key: KeyPressInterface) {
    console.log('key press:', key);
    if (key.special) {
      this.handleSpecialKey(key.value);
    } else {
      this.handleNormalKey(key.value);
      this.dispatchEvents(key);
    }
  }

  private handleSpecialKey(value: string) {
    switch (value) {
      case KeyboardKey.Space:
        this.handleNormalKey(' ');
        break;
      case KeyboardKey.Backspace:
        if (this.getCursorPosition() > 0) {
          const current: string = this.inputValue;
          const caret: number = this.input ? this.getCursorPosition() : 0;

          if (current.length > caret) {
            this.inputValue = [
              current.slice(0, caret - 1),
              current.slice(caret)
            ].join('');
          } else {
            this.inputValue = current.substring(0, current.length - 1);
          }

          this.setCursorPosition(caret - 1);
        }
        break;
      case KeyboardKey.Enter:
        this.pressEnter();
        break;
      case KeyboardKey.ArrowRight:
        this.setCursorPosition(this.getCursorPosition() + 1);
        break;
      case KeyboardKey.ArrowLeft:
        if (this.getCursorPosition() > 0) {
          this.setCursorPosition(this.getCursorPosition() - 1);
        }
        break;
      case KeyboardKey.CapsLock:
        this.toggleCapsLock();
        break;
      case KeyboardKey.Shift:
        this.toggleShift();
        break;
      case KeyboardKey.Alt:
      case KeyboardKey.AltGraph:
      case KeyboardKey.AltLk:
        // Not yet implemented
        break;
      default:
        break;
    }
  }

  private handleNormalKey(value: string) {
    const current: string = this.inputValue;
    const caret: number = this.input ? this.getCursorPosition() : 0;

    if (current.length > caret) {
      this.inputValue = [current.slice(0, caret), value, current.slice(caret)].join('');
    } else {
      this.inputValue = `${current}${value}`;
    }

    this.setCursorPosition(caret + 1);

    if (this.shift) {
      this.toggleShift();
    }
  }

  private get inputValue(): string {
    if (this.control) {
      return this.control.value;
    }
  }

  private set inputValue(value: string) {
    if (this.control) {
      this.control.setValue(value);
    }
  }

  private getCursorPosition(): number {
    if (!this.input) {
      return;
    }

    return this.input.nativeElement.selectionStart;
  }

  private setCursorPosition(position: number): boolean {
    if (!this.input) {
      return;
    }

    this.input.nativeElement.focus();
    this.input.nativeElement.setSelectionRange(position, position);
    return true;
  }

  private toggleCapsLock() {
    this.lock = !this.lock;
    this.keyService.toggleCapsLock(this.lock);
  }

  private toggleShift() {
    let upper: boolean;
    this.shift = !this.shift;
    if (this.lock) {
      upper = !this.shift;
    } else {
      upper = this.shift;
    }

    this.keyService.shiftPressed(upper);
  }

  private pressEnter() {
    this.input.nativeElement.blur();
  }

  private dispatchEvents(event: KeyPressInterface) {
    const eventInit: KeyboardEventInit = {
      bubbles: true,
      cancelable: true,
      shiftKey: this.shift,
      key: event.value,
      code: `Key${event.value.toUpperCase()}}`,
      location: 0
    };

    this.input.nativeElement.dispatchEvent(new KeyboardEvent('keydown', eventInit));
    this.input.nativeElement.dispatchEvent(new KeyboardEvent('keypress', eventInit));
    this.input.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    this.input.nativeElement.dispatchEvent(new KeyboardEvent('keyup', eventInit));
  }
}

import { Component, OnInit, Input, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { KeyPressInterface } from '../../interfaces/key-press.interface';
import { isSpacer, isSpecial, SpecialKeyTexts, SpecialKeysIcons } from '../../keyboard-layout';
import { Subscription, BehaviorSubject } from 'rxjs';
import { KeyService } from '../../services/key.service';
import { KeyboardKey } from '../../enums/keyboard-key.enum';

/**
 *KeyboardKeyComponent class.
 *
 * @export
 * @class KeyboardKeyComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'als-keyboard-key',
  templateUrl: './keyboard-key.component.html',
  styleUrls: ['./keyboard-key.component.scss']
})
export class KeyboardKeyComponent implements OnInit, OnDestroy {
  @Input() key: string;
  @Output() keyPress = new EventEmitter<KeyPressInterface>();

  private subLock: Subscription;
  private subShift: Subscription;

  public value: string;
  public flex: string;
  public spacer = false;
  public special = false;
  public icon: string;
  public text: string;
  public cssClass: string;
  public active = false;

  public width = 50;
  public height = 50;
  public size = 28;

  public pressed$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  set pressed(value: boolean) {
    this.pressed$.next(value);
  }

  /**
   *Creates an instance of KeyboardKeyComponent.
   * @param {KeyService} keyService
   * @memberof KeyboardKeyComponent
   */
  constructor(private keyService: KeyService) { }

  ngOnInit() {
    let multiplier = 1;
    let fix = 0;

    if (this.key.length > 1) {
      this.spacer = isSpacer(this.key);
      this.special = isSpecial(this.key);

      const matches = /^(\w+)(:(\d+(\.\d+)?))?$/g.exec(this.key);

      this.value = matches[1];

      if (matches[3]) {
        multiplier = parseFloat(matches[3]);
        fix = (multiplier - 1) * 6;
      }
    } else {
      this.value = this.key;
    }

    if (this.special) {
      if (SpecialKeysIcons.hasOwnProperty(this.value)) {
        if (this.value === KeyboardKey.CapsLock) {
          this.icon = SpecialKeysIcons['Unlock'];
        } else {
          this.icon = SpecialKeysIcons[this.value];
        }
      } else if (SpecialKeyTexts.hasOwnProperty(this.value)) {
        this.text = SpecialKeyTexts[this.value];
      }
    }

    this.flex = `${multiplier * this.width + fix}px`;

    if (this.value === KeyboardKey.CapsLock) {
      this.cssClass = 'als-keyboard-key-capslock';
      this.icon = SpecialKeysIcons['Unlock'];
      this.active = false;
    }
    this.subLock = this.keyService.lockChanged.subscribe((lock: boolean) => {
      if (this.special && this.value === 'Lock') {
        this.icon = lock ? SpecialKeysIcons['Lock'] : SpecialKeysIcons['Unlock'];
        // this.cssClass = lock ? 'als-keyboard-key-capslock-active' : 'als-keyboard-key-capslock';
        this.active = lock;
      } else if (!this.special) {
        this.value = lock ? this.value.toUpperCase() : this.value.toLowerCase();
      }
    });

    this.subShift = this.keyService.shiftChanged.subscribe((upper: boolean) => {
      if (!this.special) {
        this.value = upper ? this.value.toUpperCase() : this.value.toLowerCase();
      }
    });
  }

  onKeyPress(event: MouseEvent): void {
    this.keyPress.emit({
      special: this.special,
      value: this.value,
    });
  }

  ngOnDestroy(): void {
    if (this.subLock) {
      this.subLock.unsubscribe();
    }

    if (this.subShift) {
      this.subShift.unsubscribe();
    }
  }
}

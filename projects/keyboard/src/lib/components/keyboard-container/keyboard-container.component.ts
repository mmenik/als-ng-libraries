import {
  Component, OnInit, ComponentRef, ViewChild,
  ChangeDetectionStrategy, EmbeddedViewRef, NgZone, HostListener, ChangeDetectorRef,
  OnDestroy,
  HostBinding
} from '@angular/core';
import { ComponentPortal, CdkPortalOutlet, BasePortalOutlet } from '@angular/cdk/portal';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { AnimationCurves, AnimationDurations } from '@angular/material/core';
import { KeyboardAnimationState } from '../../enums/keyboard-animation-state.enum';
import { KeyboardAnimationTransition } from '../../enums/keyboard-animation-transition.enum';

export const SHOW_ANIMATION = `${AnimationDurations.ENTERING} ${AnimationCurves.DECELERATION_CURVE}`;
export const HIDE_ANIMATION = `${AnimationDurations.EXITING} ${AnimationCurves.ACCELERATION_CURVE}`;

import { KeyService } from '../../services/key.service';
import { Subject } from 'rxjs';

/**
 *KeyboardContainerComponent class.
 *
 * @export
 * @class KeyboardContainerComponent
 * @extends {BasePortalOutlet}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'als-keyboard-container',
  templateUrl: './keyboard-container.component.html',
  styleUrls: ['./keyboard-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  animations: [
    trigger('state', [
      state(`${KeyboardAnimationState.Visible}`, style({ transform: 'translateY(0%)' })),
      transition(`${KeyboardAnimationTransition.Hide}`, animate(HIDE_ANIMATION)),
      transition(`${KeyboardAnimationTransition.Show}`, animate(SHOW_ANIMATION))
    ])
  ]
})
export class KeyboardContainerComponent extends BasePortalOutlet implements OnDestroy {
  private destroyed = false;

  @ViewChild(CdkPortalOutlet)
  private portalOutlet: CdkPortalOutlet;

  @HostBinding('@state')
  public animationState: KeyboardAnimationState = KeyboardAnimationState.Void;

  /** Subject for notifying that the keyboard has exited from view. */
  onExit: Subject<any> = new Subject();
  /** Subject for notifying that the keyboard has finished entering the view. */
  onEnter: Subject<any> = new Subject();

  /**
   *Creates an instance of KeyboardContainerComponent.
   * @param {KeyService} keyService
   * @param {NgZone} ngZone
   * @param {ChangeDetectorRef} changeDetectorRef
   * @memberof KeyboardContainerComponent
   */
  constructor(private keyService: KeyService,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    event.preventDefault();
  }

  attachTemplatePortal(): EmbeddedViewRef<any> {
    throw Error('Not yet implemented');
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this.portalOutlet.hasAttached()) {
      throw Error('Attempting to attach keyboard content after content is already attached');
    }
    return this.portalOutlet.attachComponentPortal(portal);
  }

  @HostListener('@state.done', ['$event'])
  onAnimationEnd(event: AnimationEvent) {
    const { fromState, toState } = event;

    if ((toState === KeyboardAnimationState.Void && fromState !== KeyboardAnimationState.Void) || toState.startsWith('hidden')) {
      this.completeExit();
    }

    if (toState === KeyboardAnimationState.Visible) {
      // Note: we shouldn't use `this` inside the zone callback,
      // because it can cause a memory leak.
      const onEnter = this.onEnter;

      this.ngZone.run(() => {
        onEnter.next();
        onEnter.complete();
      });
    }
  }

  enter() {
    if (!this.destroyed) {
      this.animationState = KeyboardAnimationState.Visible;
      this.changeDetectorRef.detectChanges();
    }
  }

  exit() {
    this.animationState = KeyboardAnimationState.Hidden;
    return this.onExit;
  }

  private completeExit() {
    this.ngZone.onMicrotaskEmpty
      .asObservable()
      .subscribe(() => {
        this.onExit.next();
        this.onExit.complete();
      });
      // this.ngZone.onMicrotaskEmpty
      // .asObservable()
      // .first()
      // .subscribe(() => {
      //   this.onExit.next();
      //   this.onExit.complete();
      // });
  }

  ngOnDestroy() {
    this.destroyed = true;
    this.completeExit();
  }
}

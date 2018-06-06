import { Injectable, ComponentRef } from '@angular/core';
import { KeyboardRef } from '../classes/keyboard-ref.class';
import { KeyboardComponent } from '../components/keyboard/keyboard.component';
import { OverlayRef, OverlayConfig, Overlay } from '@angular/cdk/overlay';
import { KeyboardContainerComponent } from '../components/keyboard-container/keyboard-container.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { keyboardLayouts } from '../keyboard-layout';

/**
 *KeyboeardService class.
 *
 * @export
 * @class KeyboardService
 */
@Injectable()
export class KeyboardService {
    private keyboardRefAtThisLevel: KeyboardRef<KeyboardComponent> | null = null;
    private position: string;

    private get openedKeyboardRef(): KeyboardRef<KeyboardComponent> | null {
        return this.keyboardRefAtThisLevel;
    }

    private set openedKeyboardRef(value: KeyboardRef<KeyboardComponent>) {
        this.keyboardRefAtThisLevel = value;
    }

    /**
     *Creates an instance of KeyboardService.
     * @param {Overlay} overlay
     * @memberof KeyboardService
     */
    constructor(private overlay: Overlay) { }

    open(keyboardLayout: string, keyboardTheme: string, keyboardPosition: string): KeyboardRef<KeyboardComponent> {
        this.position = keyboardPosition;

        const keyboardRef: KeyboardRef<KeyboardComponent> = this.attachKeyboardContent();

        keyboardRef.instance.keyboardLayout = keyboardLayouts[keyboardLayout];
        keyboardRef.instance.keyboardTheme = keyboardTheme;
        keyboardRef.containerIntance.enter();

        this.openedKeyboardRef = keyboardRef;
        return this.openedKeyboardRef;
    }

    private attachKeyboardContent(): KeyboardRef<KeyboardComponent> {
        const overlayRef = this.createOverlay();
        const container = this.attachKeyboardContainer(overlayRef);
        const portal = new ComponentPortal(KeyboardComponent);
        const contentRef = container.attachComponentPortal(portal);

        return new KeyboardRef(contentRef.instance, container, overlayRef) as KeyboardRef<KeyboardComponent>;
    }

    private attachKeyboardContainer(overlayRef: OverlayRef): KeyboardContainerComponent {
        const containerPortal = new ComponentPortal(KeyboardContainerComponent);
        const containerRef: ComponentRef<KeyboardContainerComponent> = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }

    private createOverlay(): OverlayRef {
        const state = new OverlayConfig();
        switch (this.position) {
            case 'top left':
                state.positionStrategy = this.overlay
                    .position()
                    .global()
                    .left('10px')
                    .top('10px');
                break;
            case 'top center':
                state.positionStrategy = this.overlay
                    .position()
                    .global()
                    .centerHorizontally()
                    .top('10px');
                break;
            case 'top right':
                state.positionStrategy = this.overlay
                    .position()
                    .global()
                    .right('10px')
                    .top('10px');
                break;
            case 'center left':
                state.positionStrategy = this.overlay
                    .position()
                    .global()
                    .left('10px')
                    .centerVertically();
                break;
            case 'center center':
                state.positionStrategy = this.overlay
                    .position()
                    .global()
                    .centerHorizontally()
                    .centerVertically();
                break;
            case 'center right':
                state.positionStrategy = this.overlay
                    .position()
                    .global()
                    .right('10px')
                    .centerVertically();
                break;
            case 'bottom left':
                state.positionStrategy = this.overlay
                    .position()
                    .global()
                    .left('10px')
                    .bottom('10px');
                break;
            case 'bottom center':
                state.positionStrategy = this.overlay
                    .position()
                    .global()
                    .centerHorizontally()
                    .bottom('10px');
                break;
            case 'bottom right':
                state.positionStrategy = this.overlay
                    .position()
                    .global()
                    .right('10px')
                    .bottom('10px');
                break;
            default:
                state.positionStrategy = this.overlay
                    .position()
                    .global()
                    .centerHorizontally()
                    .centerVertically();
                break;
        }

        return this.overlay.create(state);
    }
}

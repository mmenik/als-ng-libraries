import { KeyboardComponent } from '../components/keyboard/keyboard.component';
import { KeyboardContainerComponent } from '../components/keyboard-container/keyboard-container.component';
import { OverlayRef } from '@angular/cdk/overlay';

/**
 *KeyboardRef class.
 *
 * @export
 * @class KeyboardRef
 * @template T
 */
export class KeyboardRef<T> {
    instance: KeyboardComponent;
    containerIntance: KeyboardContainerComponent;

    /**
     *Creates an instance of KeyboardRef.
     * @param {KeyboardComponent} instance
     * @param {KeyboardContainerComponent} containerInstance
     * @param {OverlayRef} overlayRef
     * @memberof KeyboardRef
     */
    constructor(instance: KeyboardComponent,
        containerInstance: KeyboardContainerComponent,
        private overlayRef: OverlayRef) {

        this.instance = instance;
        this.containerIntance = containerInstance;

        this.containerIntance.onExit.subscribe(() => this.finishDismiss());
    }

    dismiss() {
        this.containerIntance.exit();
    }

    private finishDismiss() {
        this.overlayRef.dispose();
    }
}

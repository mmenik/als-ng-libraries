import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
/**
 *KeyService class.
 *
 * @export
 * @class KeyService
 */
@Injectable()
export class KeyService {
    /**
     *Lock observable.
     *
     * @type {ReplaySubject<boolean>}
     * @memberof KeyService
     */
    public lockChanged: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     *Shift observable.
     *
     * @type {ReplaySubject<boolean>}
     * @memberof KeyService
     */
    public shiftChanged: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     *Creates an instance of KeyService.
     * @memberof KeyService
     */
    constructor() { }

    /**
     *toggleCapsLock function.
     *
     * @param {boolean} lock
     * @memberof KeyService
     */
    public toggleCapsLock(lock: boolean) {
        this.lockChanged.next(lock);
    }

    /**
     *shiftPressed function.
     *
     * @param {boolean} upper
     * @memberof KeyService
     */
    public shiftPressed(upper: boolean) {
        this.shiftChanged.next(upper);
    }
}

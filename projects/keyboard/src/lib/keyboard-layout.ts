/**
 *
 *
 * @export
 * @interface KeyboardLayout
 */
export interface KeyboardLayout {
    keys: Array<Array<string>>;
}

/**
 *
 *
 * @export
 * @interface KeyboardLayouts
 */
export interface KeyboardLayouts {
    [layout: string]: KeyboardLayout;
}


export const keyboardLayouts: KeyboardLayouts = {
    'alphanumeric': {
        keys: [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace:1'],
            ['Spacer:0.5', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'Spacer:0.5'],
            ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Spacer'],
            ['Shift:1.5', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Enter:2.5'],
            ['ArrowLeft:2', 'Space:7', 'ArrowRight:2']
        ]
    },
    'numeric': {
        keys: [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['0', 'Enter:2'],
        ]
    }
};

// export const AlphanumericKeyboard: KeyboardLayout = [
//     ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace:1'],
//     ['Spacer:0.5', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'Spacer:0.5'],
//     ['Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Spacer'],
//     ['Shift:1.5', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Enter:2.5'],
//     ['Left:2', 'Space:7', 'Right:2']
// ];

// export const NumericKeyboard: KeyboardLayout = [
//     ['1', '2', '3'],
//     ['4', '5', '6'],
//     ['7', '8', '9'],
//     ['', '0', ''],
// ];

export const SpecialKeys: Array<string> = [
    'Backspace',
    'ArrowLeft',
    'ArrowRight',
    'Space',
    'Spacer',
    'Shift',
    'Enter',
    'CapsLock'
];

export const SpecialKeysIcons = {
    Backspace: 'fa fa-long-arrow-alt-left',
    ArrowRight: 'fa fa-caret-right',
    ArrowLeft: 'fa fa-caret-left',
    Shift: 'fa fa-angle-up',
    Lock: 'fa fa-lock',
    Unlock: 'fa fa-unlock-alt'
};

export const SpecialKeyTexts = {
    Enter: 'Enter'
};

/**
 *
 *
 * @export
 * @param {string} key
 * @returns {boolean}
 */
export function isSpacer(key: string): boolean {
    if (key.length > 1) {
        return /^Spacer(:(\d+(\.\d+)?))?$/g.test(key);
    }

    return false;
}

/**
 *
 *
 * @export
 * @param {string} key
 * @returns {boolean}
 */
export function isSpecial(key: string): boolean {
    if (key.length > 1) {
        return !!SpecialKeys.filter(specialKey => {
            const pattern = new RegExp(`^(${specialKey})(:(\\d+(\\.\\d+)?))?$`, 'g');

            return pattern.test(key);
        }).length;
    }

    return false;
}

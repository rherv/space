interface Keys {
    [key: string]: boolean;
}

export namespace Input {
    let keys: Keys = {};


    export function onKeyDown(event: KeyboardEvent): void {
        keys[event.key] = true;
    }

    export function onKeyup(event: KeyboardEvent): void {
        keys[event.key] = false;
    }

    export function getKey(key: string): boolean {
        return keys[key] === undefined ? false : keys[key];
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyup);
}
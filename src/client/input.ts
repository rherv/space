interface Keys {
    [key: string]: number;
}

export namespace Input {
    let keys: Keys = {};


    export function onKeyDown(event: KeyboardEvent): void {
        keys[event.key] = 1;
    }

    export function onKeyup(event: KeyboardEvent): void {
        keys[event.key] = 0;
    }

    export function getKey(key: string): number {
        return keys[key] === undefined ? 0 : keys[key];
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyup);
}
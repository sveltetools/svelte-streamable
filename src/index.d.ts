import type { Readable, Unsubscriber } from 'svelte/store';

export type Format = 'json' | 'base64' | 'urlencoded' | 'raw';

export interface Config {
    url: string;
    event?: string;
    format?: Format;
    withCredentials?: boolean;
}

export declare function streamable<T, U = void>(
    config: Config,
    callback?: (
        data: T,
        set?: (value: U | T) => void
    ) => Unsubscriber | U | T | void,
    defaultValue?: T
): Readable<Promise<U | T>>;

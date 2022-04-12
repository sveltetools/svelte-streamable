import type { Readable, Unsubscriber } from 'svelte/store';

export type Format = 'json' | 'raw';

export interface Config {
    url: string;
    event?: string;
    format?: Format;
    withCredentials?: boolean;
}
export declare function streamable<T>(
    config: Config,
    callback?: (data: T, set?: (value: T) => void) => Unsubscriber | T | void,
    defaultValue?: T
): Readable<Promise<T>>;

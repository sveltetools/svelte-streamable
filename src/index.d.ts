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
    callback?: (data: unknown, set?: (value: T) => void) => Unsubscriber | void,
    initialValue?: T
): Readable<T>;

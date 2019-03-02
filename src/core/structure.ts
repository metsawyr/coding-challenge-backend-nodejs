import { JoiObject } from 'joi';

export interface Dictionary<T = any> {
    [key: string]: T;
}

export type Constructable<T> = new(...args: Array<any>) => T;

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type ValidationSchema<T> = {
    [P in keyof T]: JoiObject;
};

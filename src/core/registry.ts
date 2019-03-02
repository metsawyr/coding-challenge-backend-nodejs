import { Dictionary } from './structure';

export class Registry<T = any> {
    protected registry: Dictionary<T> = {};

    public has(key: string) {
        return Object.prototype.hasOwnProperty.call(this.registry, key);
    }

    public get(key: string) {
        return this.registry[key];
    }

    public set(key: string, value: T) {
        this.registry[key] = value;
    }
}

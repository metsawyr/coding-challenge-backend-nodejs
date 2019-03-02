import { Dictionary } from './structure';

export function toLowerFirst(target: string){
    return target && target[0].toLowerCase() + target.slice(1);
}

export function toUpperFirst(target: string){
    return target && target[0].toUpperCase() + target.slice(1);
}

export function splitObject<T>(target: Dictionary<T>) {
    return Object.entries(target).reduce(
        (result, [key, value]) => {
            result.keys.push(key);
            result.values.push(value);

            return result;
        },
        {
            keys: [] as Array<string>,
            values: [] as Array<T>,
        }
    );
}

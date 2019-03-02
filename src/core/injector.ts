/**
 * Custom dependency injection using decorators.
 */

import { Registry } from './registry';
import { Constructable, Dictionary } from './structure';
import { toLowerFirst } from './utils';

interface AwaitingProvider {
    providerClass: Function;
    propertyName: string;
}

export const serviceRegistry = new Registry();
const awaiting: Dictionary<Array<AwaitingProvider>> = {};

export function Inject(name?: string) {
    return (target: any, propertyName: string) => {
        const injectingName = name || propertyName;

        if (!serviceRegistry.has(injectingName)) {
            if (!Array.isArray(awaiting[injectingName])) {
                awaiting[injectingName] = [];
            }
            awaiting[injectingName].push({
                providerClass: target.constructor,
                propertyName
            });

            return;
        }

        target[propertyName] = serviceRegistry.get(injectingName);
    };
}

export function Injectable(...bound: Array<any>) {
    return (Constructor: Constructable<any>) => {
        const provider = new Constructor(...bound);
        const injectableName = toLowerFirst(Constructor.name);
        serviceRegistry.set(injectableName, provider);
        fulfillAwaiters(injectableName, provider);
    };
}

export const injector = {
    get(key: string) {
        return serviceRegistry.get(key);
    },
    set(key: string, value: any) {
        serviceRegistry.set(key, value);
        fulfillAwaiters(key, value);
    }
};

function fulfillAwaiters(key: string, value: any) {
    const awaitingDependents = awaiting[key];

    if (Array.isArray(awaitingDependents)) {
        awaitingDependents.forEach((dependent) => {
            Object.defineProperty(
                dependent.providerClass.prototype,
                dependent.propertyName,
                {
                    configurable: false,
                    writable: false,
                    value
                }
            );
        });

        delete awaiting[key];
    }
}

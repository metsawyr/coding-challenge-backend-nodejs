import { Constructable, Dictionary } from '../structure';

export interface MiddlewareInstance {
    controller: any;
    handlers: Array<HandlerInstance>;
}

export interface HandlerInstance {
    name?: string;
    functionName: string;
}

export const middlewareRegistry: Dictionary<MiddlewareInstance> = {};

export function getMiddleware(middlewareName: string) {
    if (!Object.prototype.hasOwnProperty.call(middlewareRegistry, middlewareName)) {
        middlewareRegistry[middlewareName] = {
            controller: {},
            handlers: [],
        };
    }

    return middlewareRegistry[middlewareName];
}

export function Middleware(Constructor: Constructable<any>) {
    const middleware = getMiddleware(Constructor.name);
    middleware.controller = new Constructor();
}

export function Handler(name?: string) {
    return (controller: any, propertyName: string) => {
        const middleware = getMiddleware(controller.constructor.name);
        middleware.handlers.push({
            name,
            functionName: propertyName
        });
    };
}

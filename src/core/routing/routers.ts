import { Constructable, Dictionary } from '../structure';

export type RouterMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface RouterInstance {
    controller: any;
    path: string;
    endpoints: Dictionary<EndpointInstance>;
}

export interface EndpointInstance {
    method: RouterMethod;
    path: string;
    middleware: Array<string>;
    arguments: Array<string>;
}

export const routerRegistry: Dictionary<RouterInstance> = {};

export function getRouter(routerName: string) {
    if (!Object.prototype.hasOwnProperty.call(routerRegistry, routerName)) {
        routerRegistry[routerName] = {
            controller: undefined,
            path: undefined,
            endpoints: {},
        };
    }

    return routerRegistry[routerName];
}

export function getEndpoint(routerName: string, endpointName: string) {
    const router = getRouter(routerName);

    if (!Object.prototype.hasOwnProperty.call(router.endpoints, endpointName)) {
        router.endpoints[endpointName] = {
            method: undefined,
            path: undefined,
            middleware: [],
            arguments: [],
        };
    }

    return router.endpoints[endpointName];
}

export function Router(path: string) {
    return (Constructor: Constructable<any>) => {
        const router = getRouter(Constructor.name);
        router.controller = new Constructor();
        router.path = path;
    };
}

export function Endpoint(method: RouterMethod, path: string) {
    return (controller: any, propertyName: string) => {
        const routerName = controller.constructor.name;
        const endpoint = getEndpoint(routerName, propertyName);
        endpoint.method = method;
        endpoint.path = path;
    };
}

export function Use(name: string) {
    return (controller: any, propertyName: string) => {
        const controllerName = controller.constructor.name;
        const endpoint = getEndpoint(controllerName, propertyName);
        endpoint.middleware.push(name);
    };
}

export function Authentication() {
    return Use('authentication');
}

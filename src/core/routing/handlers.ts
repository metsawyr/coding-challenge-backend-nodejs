import { getEndpoint } from './routers';

function Argument(path: string) {
    return (controller: any, functionName: string, argumentOrder: number) => {
        const endpoint = getEndpoint(controller.constructor.name, functionName);
        endpoint.arguments[argumentOrder] = path;
    };
}

export function Request() {
    return Argument(`req`);
}

export function Body(name?: string) {
    return Argument('req.body' + (name ? `.${name}` : ''));
}

export function Params(name: string) {
    return Argument(`req.params.${name}`);
}

export function Query(name: string) {
    return Argument(`req.query.${name}`);
}

export function Headers(name: string) {
    return Argument(`req.headers.${name}`);
}

export function Cookies(name: string) {
    return Argument(`req.cookies.${name}`);
}

export function Response() {
    return Argument(`res`);
}

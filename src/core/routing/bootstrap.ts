import * as bodyParser from 'body-parser';
import * as config from 'config';
import * as express from 'express';
import { Dictionary } from '../structure';
import { middlewareRegistry } from './middleware';
import { EndpointInstance, RouterInstance, RouterMethod, routerRegistry } from './routers';

(function (app: express.Application) {
    const middlewareHandlers: Dictionary<express.RequestHandler> = {};

    for (const middlewareName of Object.keys(middlewareRegistry)) {
        const middleware = middlewareRegistry[middlewareName];

        for (const handler of middleware.handlers) {
            const key = handler.name || handler.functionName;
            middlewareHandlers[key] = middleware.controller[handler.functionName].bind(middleware.controller);
        }
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/assets', express.static('dist/public'));

    const mergedEndpoints = Object.values(routerRegistry).reduce(
        (routerEndpoints, router) => {
            return routerEndpoints.concat(
                Object.entries(router.endpoints).map(
                    ([name, endpoint]) => ({
                        router,
                        endpoint,
                        name,
                    })
                )
            );
        },
        [] as Array<{endpoint: EndpointInstance; router: RouterInstance; name: string; }>
    );

    const endpoints = mergedEndpoints
        .map(
            (item) => {
                const endpointPath = `/${item.router.path}/${item.endpoint.path}`
                    .replace(/\/+/g, '/')
                    .replace(/\/$/, '');
                
                return {
                    router: item.router,
                    name: item.name,
                    path: endpointPath,
                    handler: item.endpoint
                };
            }
        )
        .sort(
            (left, right) => {
                const leftPath = left.path.split('/');
                const rightPath = right.path.split('/');
                const leftLast = leftPath[leftPath.length - 1];
                const rightLast = rightPath[rightPath.length - 1];

                if (leftLast === '*' && rightLast !== '*') {
                    return 1;
                }
                else if (leftLast !== '*' && rightLast === '*') {
                    return -1;
                }
                else {
                    return rightPath.length - leftPath.length;
                }
            }
        );
        
    for (const endpoint of endpoints) {
        app[endpoint.handler.method as RouterMethod](
            endpoint.path,
            ...endpoint.handler.middleware.reverse().map((key) => middlewareHandlers[key]),
            (req: express.Request, res: express.Response, next: express.NextFunction) => {
                const args = endpoint.handler.arguments.map((path) => {
                    const objs: Dictionary<any> = { req, res };

                    if (path.indexOf('.')) {
                        const subs = path.split('.');
                        let ret: Dictionary<any> = objs;

                        for (const sub of subs) {
                            ret = ret[sub];
                        }

                        return ret;
                    }

                    return objs[path];
                });

                endpoint.router.controller[endpoint.name]
                    .apply(endpoint.router.controller, args);
            }
        );
    }

    app.use(
        (error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (error) {
                // if (error instanceof AppError) {
                //     res.status(error.code).json({ error: error.message });
                // }
                // else {
                    res.status(500).json(error);
                // }
            }
            next();
        }
    );

    const port = config.get('app.port');
    app.listen(port);

})(express());

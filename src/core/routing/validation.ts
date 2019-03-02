import { NextFunction, Request, Response } from 'express';
import * as Joi from 'joi';
import { getMiddleware } from './middleware';
import { getEndpoint } from './routers';

export function Validation(scheme: Joi.SchemaLike) {
    return (controller: any, propertyName: string) => {
        const name = `$validate.${propertyName}`;
        const middleware = getMiddleware('$Validation');
        middleware.controller[name] = (req: Request, res: Response, next: NextFunction) => {
            const data = Object.assign({}, req.body, req.query, req.params);
            const result = Joi.validate(data, scheme);

            if (result.error) {
                return next(new Error(result.error.message));
            }

            next();
        };
        
        middleware.handlers.push({
            functionName: name,
        });

        const endpoint = getEndpoint(controller.constructor.name, propertyName);
        endpoint.middleware.push(name);
    };
}

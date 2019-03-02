import * as Joi from 'joi';
import { ValidationSchema } from '../core/structure';
import { StealCaseCreateRequest } from '../daos/steal-case';
import { BikeType, StealCaseScheme } from '../schemes/steal-case';

export const StealCaseValidation = {
    Create: {
        ownerName: Joi.string().required(),
        licenseNumber: Joi.string().required(),
        color: Joi.string(),
        district: Joi.number(),
        stealDetails: Joi.string().required(),
        type: Joi.string().valid([
            BikeType.Beach,
            BikeType.Cyclocross,
            BikeType.Folding,
            BikeType.Hybrid,
            BikeType.Kids,
            BikeType.Mountain,
            BikeType.Road,
            BikeType.Tandem,
            BikeType.Track,
            BikeType.Triathlon,
            BikeType.Trick,
        ]).required(),
    } as ValidationSchema<StealCaseCreateRequest>,
    Close: {
        id: Joi.number().required(),
        resolutionReport: Joi.string().required(),
    } as ValidationSchema<Pick<StealCaseScheme, 'id' | 'resolutionReport'>>
};

import * as Joi from 'joi';
import { ValidationSchema } from '../core/structure';
import { StealCaseCreateRequest } from '../daos/steal-case';
import { BikeType } from '../schemes/steal-case';

export const StealCaseValidation = {
    Create: {
        color: Joi.string(),
        licenseNumber: Joi.number(),
        ownerName: Joi.string(),
        stealDetails: Joi.string(),
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
        ])
    } as ValidationSchema<StealCaseCreateRequest>,
};

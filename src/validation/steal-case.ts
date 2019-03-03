import * as Joi from 'joi';
import { ValidationSchema } from '../core/structure';
import { StealCaseCreateRequest } from '../daos/steal-case';
import { BikeType, CaseStatus, StealCaseScheme } from '../schemes/steal-case';

const bikeTypes = Joi.string().valid([
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
]);

const caseStatus = Joi.string().valid([
    CaseStatus.New,
    CaseStatus.Pending,
    CaseStatus.Closed,
    CaseStatus.Reopened,
]);

export const StealCaseValidation = {
    Create: {
        ownerName: Joi.string().required(),
        licenseNumber: Joi.string().required(),
        color: Joi.string(),
        district: Joi.number(),
        stealDetails: Joi.string().required(),
        type: bikeTypes.required(),
    } as ValidationSchema<StealCaseCreateRequest>,
    Close: {
        id: Joi.number().required(),
        resolutionReport: Joi.string().required(),
    } as ValidationSchema<Pick<StealCaseScheme, 'id' | 'resolutionReport'>>,
    Filter: {
        ownerName: Joi.string(),
        licenseNumber: Joi.string(),
        color: Joi.string(),
        type: bikeTypes,
        stealDetails: Joi.string(),
        officer: Joi.number(),
        status: caseStatus,
        department: Joi.number()
    } as ValidationSchema<Partial<StealCaseScheme & { department: number }>>
};

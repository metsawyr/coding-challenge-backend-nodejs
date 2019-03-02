import * as Express from 'express';
import * as HttpStatus from 'http-status';
import { Inject } from '../core/injector';
import { Body, Endpoint, Params, Response, Router, Validation } from '../core/routing';
import { StealCaseCreateRequest } from '../daos/steal-case';
import { StealCaseService } from '../services/steal-case';
import { StealCaseValidation } from '../validation/steal-case';

@Router('/cases')
export class StealCaseController {
    @Inject() private stealCaseService: StealCaseService;

    @Endpoint('post', '/')
    @Validation(StealCaseValidation.Create)
    public async createStealCase(
        @Body() caseObject: StealCaseCreateRequest,
        @Response() res: Express.Response
    ) {
        await this.stealCaseService.createCase(caseObject);
        res.status(HttpStatus.CREATED).send();
    }

    @Endpoint('patch', '/:id/close')
    @Validation(StealCaseValidation.Close)
    public async closeStealCase(
        @Params('id') id: string,
        @Body('resolutionReport') report: string,
        @Response() res: Express.Response
    ) {
        await this.stealCaseService.closeCase(Number(id), report);
        res.status(HttpStatus.OK).send();
    }
}

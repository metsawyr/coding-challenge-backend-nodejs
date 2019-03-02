import * as moment from 'moment';
import { connection } from '../core/connection';
import { Injectable } from '../core/injector';
import { CaseStatus, StealCaseScheme } from '../schemes/steal-case';
import { Dao } from './_base';

export type StealCaseCreateRequest = Pick<
    StealCaseScheme,
    'ownerName'
    | 'licenseNumber'
    | 'color'
    | 'type'
    | 'stealDetails'
>;

@Injectable(connection)
export class StealCaseDao extends Dao<StealCaseScheme> {
    protected tableName = 'steal_cases';

    public createCase(caseObject: StealCaseCreateRequest) {
        return this.create({
            ...caseObject,
            dateCreated: moment().format('YYYY-MM-DD HH:mm:ss'),
            status: CaseStatus.New,
        });
    }

}

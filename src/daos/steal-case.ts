import * as moment from 'moment';
import { connection } from '../core/connection';
import { Injectable } from '../core/injector';
import { Omit } from '../core/structure';
import { CaseStatus, StealCaseScheme } from '../schemes/steal-case';
import { Dao } from './_base';

export type StealCaseCreateRequest = Pick<
    StealCaseScheme,
    'ownerName'
    | 'licenseNumber'
    | 'color'
    | 'district'
    | 'stealDetails'
    | 'type'
>;

export type StealCaseUpdateRequest = Partial<
    Omit<
        StealCaseScheme,
        'id'
    >
>;

export type StealCaseCloseRequest = Pick<
    StealCaseScheme,
    'id' | 'resolutionReport'
>;

@Injectable(connection)
export class StealCaseDao extends Dao<StealCaseScheme> {
    public tableName = 'steal_cases';

    public async createCase(caseObject: StealCaseCreateRequest) {
        return this.create({
            ...caseObject,
            dateCreated: moment().format('YYYY-MM-DD HH:mm:ss'),
            status: CaseStatus.New,
        });
    }

    public async getCase(caseId: number) {
        const [ stealCase ] = await this.get({ id: caseId });
        return stealCase;
    }

    public async listCasesByStatus(status: CaseStatus) {
        return this.get({ status });
    }

    public async updateCase(caseId: number, updateObject: StealCaseUpdateRequest) {
        return this.update(
            { id: caseId },
            updateObject
        );
    }

    public async closeCase(caseId: number, resolutionReport: string) {
        return this.update(
            { id: caseId },
            {
                resolutionReport,
                status: CaseStatus.Closed,
                dateClosed: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
        );
    }
}

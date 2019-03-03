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

    public async filterCases(filters: Partial<StealCaseScheme & { department: number }>) {
        const where = this.transformObjectToPairs(filters, { $default: 't1', department: 't2' });

        const { results } = await this.query(
            `SELECT t1.*, t2.name as officer_name, t2.department, t3.name as department_name `
            + `FROM ${this.tableName} t1 `
            + `LEFT JOIN officers t2 ON t1.officer = t2.id `
            + `LEFT JOIN departments t3 ON t2.department = t3.id`
            + (where.length ? ` WHERE ${where.join(' AND ')}` : '')
        );

        return results;
    }
}

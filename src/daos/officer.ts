import { connection } from '../core/connection';
import { Inject, Injectable } from '../core/injector';
import { Omit } from '../core/structure';
import { OfficerScheme } from '../schemes/officer';
import { CaseStatus } from '../schemes/steal-case';
import { Dao } from './_base';
import { StealCaseDao } from './steal-case';

export type OfficerCreateRequest = Pick<
    OfficerScheme,
    'name'
    | 'department'
>;

export type OfficerUpdateRequest = Partial<
    Omit<
        OfficerScheme,
        'id'
    >
>;

@Injectable(connection)
export class OfficerDao extends Dao<OfficerScheme> {
    public tableName = 'officers';
    @Inject() private stealCaseDao: StealCaseDao;

    public async createOfficer(officerObject: OfficerCreateRequest) {
        return this.create(officerObject);
    }

    public async increaseOfficerClosedCases(officerId: number) {
        return this.update(
            { id: officerId },
            {
                $inc: {
                    cases_closed: 1
                }
            }
        );
    }

    public async listFreeOfficers(): Promise<Array<OfficerScheme>> {
        // Not efficient solution. Trying to figure out implementation with JOINs
        const { results } = await this.query(
            `SELECT t1.id `
            + `FROM ${this.tableName} t1 `
            + `WHERE NOT EXISTS (`
            +     `SELECT * `
            +     `FROM ${this.stealCaseDao.tableName} t2 `
            +     `WHERE t2.status = '${CaseStatus.Pending}' and t2.officer = t1.id`
            + `)`
        );

        return results;
    }
}

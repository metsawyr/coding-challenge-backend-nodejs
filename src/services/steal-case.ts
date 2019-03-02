import { Inject, Injectable } from '../core/injector';
import { StealCaseCreateRequest, StealCaseDao } from '../daos/steal-case';
import { CaseStatus } from '../schemes/steal-case';
import { Events, EventService } from './event';

@Injectable()
export class StealCaseService {
    @Inject() private stealCaseDao: StealCaseDao;
    @Inject() private eventService: EventService;

    public async createCase(caseObject: StealCaseCreateRequest) {
        const result = await this.stealCaseDao.createCase(caseObject);
        this.eventService.emit(Events.CaseCreated, result.insertId);
    }

    public async getCase(caseId: number) {
        return this.stealCaseDao.getCase(caseId);
    }

    public async listCasesByStatus(status: CaseStatus) {
        return this.stealCaseDao.listCasesByStatus(status);
    }

    public async assignOfficer(caseId: number, officerId: number) {
        await this.stealCaseDao.updateCase(
            caseId,
            {
                officer: officerId,
                status: CaseStatus.Pending,
            }
        );
    }

    public async closeCase(caseId: number, resolutionReport: string) {
        await this.stealCaseDao.closeCase(
            caseId,
            resolutionReport
        );
        this.eventService.emit(Events.CaseClosed, caseId);
    }
}

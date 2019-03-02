import { Inject, Injectable } from '../core/injector';
import { OfficerDao } from '../daos/officer';
import { CaseStatus } from '../schemes/steal-case';
import { Events, EventService } from './event';
import { StealCaseService } from './steal-case';

@Injectable()
export class OfficerService {
    @Inject() private officerDao: OfficerDao;
    @Inject() private eventService: EventService;
    @Inject() private stealCaseService: StealCaseService;

    constructor() {
        this.eventService.addListener(Events.CaseCreated, async (caseId: number) => {
            const freeOfficers = await this.officerDao.listFreeOfficers();
            
            if (freeOfficers.length) {
                await this.stealCaseService.assignOfficer(caseId, freeOfficers[0].id);
            }
        });

        this.eventService.addListener(Events.CaseClosed, async (caseId) => {
            const stealCase = await this.stealCaseService.getCase(caseId);
            const officerId = stealCase.officer;
            await this.officerDao.increaseOfficerClosedCases(officerId);
            const openCases = await this.stealCaseService.listCasesByStatus(CaseStatus.New);

            if (openCases.length) {
                await this.stealCaseService.assignOfficer(openCases[0].id, officerId);
            }
        });
    }
}

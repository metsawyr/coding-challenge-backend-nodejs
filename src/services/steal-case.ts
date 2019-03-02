import { Inject, Injectable } from '../core/injector';
import { StealCaseCreateRequest, StealCaseDao } from '../daos/steal-case';

@Injectable()
export class StealCaseService {
    @Inject() private stealCaseDao: StealCaseDao;

    public async createCase(caseObject: StealCaseCreateRequest) {
        return this.stealCaseDao.createCase(caseObject);
    }
}

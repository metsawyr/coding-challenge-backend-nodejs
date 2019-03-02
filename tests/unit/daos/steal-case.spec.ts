// Override original mysql lib with mocked functions
import '../../mocks/external/moment.mock';
import { connectionPrototype } from '../../mocks/external/mysql.mock';

// Straight dependencies
import * as moment from 'moment';
import { connection } from '../../../src/core/connection';
import { StealCaseCreateRequest, StealCaseDao } from '../../../src/daos/steal-case';
import { BikeType, CaseStatus } from '../../../src/schemes/steal-case';

describe('StealCaseDao suite', () => {
    let dao: StealCaseDao;

    beforeAll(() => {
        dao = new StealCaseDao(connection);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should make an sql request to create steal case', async () => {
        expect.assertions(2);

        const data: StealCaseCreateRequest = {
            ownerName: 'Elon Musk',
            licenseNumber: 'EM-19710628',
            color: 'red',
            stealDetails: 'Stolen right at the backyard of Tesla HQ',
            type: BikeType.Hybrid,
        };

        await dao.createCase(data);

        expect(connectionPrototype.query).toBeCalledTimes(1);
        expect(connectionPrototype.query.mock.calls[0][0]).toBe(
            'INSERT INTO steal_cases('
                + 'ownerName,'
                + 'licenseNumber,'
                + 'color,'
                + 'stealDetails,'
                + 'type,'
                + 'dateCreated,'
                + 'status'
            + ') '
            + 'VALUES ('
                + `'${data.ownerName}',`
                + `'${data.licenseNumber}',`
                + `'${data.color}',`
                + `'${data.stealDetails}',`
                + `'${data.type}',`
                + `'${moment().format('YYYY-MM-DD HH:mm:ss')}',`
                + `'${CaseStatus.New}'`
            + ')'
        );
    });
});

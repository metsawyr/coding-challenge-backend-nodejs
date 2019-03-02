import * as moment from 'moment';

moment.fn.format = jest.fn(
    () => {
        return '2018-06-28 18:00:00';
    }
);

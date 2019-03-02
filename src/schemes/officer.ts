import { Scheme } from './_base';

export interface OfficerScheme extends Scheme {
    name: string;
    department: number;
    cases_closed: number;
}

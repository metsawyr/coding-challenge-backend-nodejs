import { Scheme } from './_base';

export interface StealCaseScheme extends Scheme {
    ownerName: string;
    licenseNumber: string;
    color: string;
    type: BikeType;
    district: number;
    stealDetails: string;
    officer: number;
    dateCreated: string;
    dateClosed: string;
    status: CaseStatus;
    resolutionReport: string;
}

export enum BikeType {
    Mountain = 'MOUNTAIN',
    Hybrid = 'HYBRID',
    Road = 'ROAD',
    Triathlon = 'TRIATHLON',
    Trick = 'TRICK',
    Cyclocross = 'CYCLOCROSS',
    Track = 'TRACK',
    Tandem = 'TANDEM',
    Folding = 'FOLDING',
    Kids = 'KIDS',
    Beach = 'BEACH',
}

export enum CaseStatus {
    New = 'NEW',
    Pending = 'PENDING',
    Closed = 'CLOSED',
    Reopened = 'REOPENED',
}

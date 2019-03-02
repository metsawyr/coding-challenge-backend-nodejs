import { EventEmitter } from 'events';
import { Injectable } from '../core/injector';

export enum Events {
    CaseCreated = 'CASE_CREATED',
    CaseClosed = 'CASE_CLOSED',
}

@Injectable()
export class EventService extends EventEmitter {}

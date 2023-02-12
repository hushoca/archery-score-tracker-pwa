import Dexie, { type Table } from 'dexie';
import type { Session } from '../types';

export class ArcheryScoreTrackerDb extends Dexie {
    sessions!: Table<Session>;
    tags!: Table<string>;

    constructor() {
        super("Main");
        this.version(1).stores({
            sessions: "++id, finishedAt"
        });
    }
}

export const db = new ArcheryScoreTrackerDb();
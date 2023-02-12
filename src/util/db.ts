import Dexie, { type Table } from 'dexie';
import type { Session, Tag } from '../types';

export class ArcheryScoreTrackerDb extends Dexie {
    sessions!: Table<Session>;
    tags!: Table<Tag>;

    constructor() {
        super("Main");
        this.version(1).stores({
            sessions: "++id, *tags, finishedAt",
            tags: "++id, *usedBy"
        });
    }
}

export const db = new ArcheryScoreTrackerDb();
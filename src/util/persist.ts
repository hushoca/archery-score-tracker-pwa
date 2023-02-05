import { browser } from "$app/environment";
import { get, type Writable } from "svelte/store";

type DataContainer =  { 
    currentVersion : number;
    [key: string] : any 
};

type PersistOptions<T> = {
    writable : Writable<T>;
    name: string;
    version: number; 
    migrations?: Migration[];
}

export function persist<T>({ name, version, writable, migrations = [] }: PersistOptions<T>) {
    const key = `${name}`;
    if(browser) {
        const dataJson = localStorage.getItem(key);
        if(dataJson !== null) {
            const dataMap = JSON.parse(dataJson) as DataContainer;
            if(dataMap.currentVersion !== version) {
                console.warn("Need for migration was detected.");
                const migrationsToApply = migrations.filter(m => m.from >= dataMap.currentVersion);
                console.info(`Found ${migrationsToApply.length} migrations to apply.`);
                migrationsToApply.forEach(({ from, to, execute }) => {
                    if(dataMap.currentVersion == from) {
                        const dataBeforeMigration = dataMap[from.toString()];
                        const dataAfterMigration = execute(dataBeforeMigration);
                        console.log({ dataBeforeMigration, dataAfterMigration });
                        dataMap[to.toString()] = dataAfterMigration;
                        writable.set(dataAfterMigration);
                        console.log(dataMap);
                        dataMap.currentVersion = to;
                        delete dataMap[from.toString()];
                        console.info(`Applied migration v${from} --> v${to}.`);
                    }
                });
                
                localStorage.setItem(key, JSON.stringify(dataMap));
            } else {
                console.info("Existing user visiting again.");
                const data = dataMap[version.toString()];
                writable.set(data);
            }
        } else {
            const initialData = get(writable);
            const dataContainer : DataContainer = {
                currentVersion: version,
                [version.toString()]: initialData
            }
            localStorage.setItem(key, JSON.stringify(dataContainer));
            console.info("It's users first visit.");
        }
        writable.subscribe(d => {
            const existingDataMapJson = localStorage.getItem(key)!;
            const existingDataMap = JSON.parse(existingDataMapJson) as DataContainer;
            existingDataMap[version.toString()] = d;
            localStorage.setItem(key, JSON.stringify(existingDataMap));
        })
    }
    return writable;
}

export interface Migration {
    from: number,
    to: number,
    execute: (data : any) => any;
}
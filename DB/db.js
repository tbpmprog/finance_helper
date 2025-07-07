
import { TABLE_SCHEMAS } from './schemas.js';
import { getAppStorage, setAppStorage } from '../Storage/storage.js';

export async function migrateStructureIfNeeded() {
    console.log ('----- [migrateStructure] -----');

    const store = getAppStorage();
    if (!store || !store.db) return;

    const schema = TABLE_SCHEMAS;
    const dbTables = store.db.tables || {};
    const seq = {};

    for (const [tableName, tableDef] of Object.entries(schema)) {
        const fields = tableDef.fields;
        let tableData = dbTables[tableName];

        if (!tableData) {
            tableData = tableDef.data ? [...tableDef.data] : [];
            dbTables[tableName] = tableData;
            console.log(`[migrateStructure] Таблица ${tableName} создана`);
        }

        if (tableDef.data?.length) {
            const existingById = Object.fromEntries(
                (dbTables[tableName] || []).map(record => [record.id, record])
            );

            for (const record of tableDef.data) {
                const id = record.id;
                if (existingById[id]) {
                    existingById[id] = {
                        ...existingById[id],
                        ...record
                    };
                } else {
                    existingById[id] = { ...record };
                }
            }

            tableData = Object.values(existingById);
            dbTables[tableName] = tableData;
        }

        dbTables[tableName] = tableData.map(entry => {
            const newEntry = {};
            for (const [field, def] of Object.entries(fields)) {
                newEntry[field] = field in entry ? entry[field] : def.default;
            }
            return newEntry;
        });

        const maxId = dbTables[tableName].reduce((max, e) => {
            const id = parseInt(e.id);
            return !isNaN(id) && id > max ? id : max;
        }, 0);

        seq[tableName] = maxId;        
    }

    dbTables.seq = Object.entries(seq).map(([name, idx]) => ({ name, idx }));

    store.db.tables = dbTables;
    setAppStorage(store);

    console.log('[migrateStructure] Структура приведена к актуальной схеме');

    return store;
}

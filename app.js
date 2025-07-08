
import { DB_VERSION } from './config.js';
import { initAppStorage, setAppStorage } from './Storage/storage.js';
import { migrateStructureIfNeeded } from './DB/db.js';

window.onload = async () => {
    await initApp ();
}

async function initApp () {
    console.log ('----- [initAPP] -----');

    let store = await initAppStorage();

    if (store.db.db_version !== DB_VERSION) {
        store = await migrateStructureIfNeeded();
        store.db.db_version = DB_VERSION;
        setAppStorage(store);
    }

    console.log('[initApp] Контейнер инициализирован:', store);
}

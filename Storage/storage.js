
import { APP_NAME, APP_VERSION, ENABLE_BACKUP_ON_INIT } from '../config.js';

export function getAppStorage() {
    const raw = localStorage.getItem(APP_NAME);
    return raw ? JSON.parse(raw) : null;
}

export function setAppStorage(data) {
    localStorage.setItem(APP_NAME, JSON.stringify(data));
}

export async function backupAppStorage() {
    console.log ('----- [backupAppStorage] -----');

    const raw = localStorage.getItem(APP_NAME);
    if (!raw) {
        console.warn(`[backup] Контейнер ${APP_NAME} не найден. Бэкап не создан.`);
        return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupKey = `${APP_NAME}_backup_${timestamp}`;

    localStorage.setItem(backupKey, raw);
    console.log(`[backup] Бэкап создан: ${backupKey}`);

    return backupKey;
}

export async function initAppStorage() {
    console.log ('----- [initAppStorage] -----');

    const raw = localStorage.getItem(APP_NAME);
    let store;

    if (!raw) {
        store = {
            db: {
                tables: {},
                db_version: ''
            },
            app_name: APP_NAME,
            app_version: APP_VERSION
        };

        localStorage.setItem(APP_NAME, JSON.stringify(store));
        console.log(`[init] Новый контейнер создан: ${APP_NAME}`);
    } else {
        store = JSON.parse(raw);

        let updated = false;
        let needBackup = false;

        if (store.app_name !== APP_NAME) {
            store.app_name = APP_NAME;
            updated = true;
            needBackup = true;
        }

        if (store.app_version !== APP_VERSION) {
            store.app_version = APP_VERSION;
            updated = true;
            needBackup = true;
        }

        if (ENABLE_BACKUP_ON_INIT && needBackup) {
            await backupAppStorage();
        }

        if (updated) {
            localStorage.setItem(APP_NAME, JSON.stringify(store));
            console.log(`[init] Обновлена информация о приложении: ${APP_NAME}`);
        } else {
            console.log(`[init] Контейнер ${APP_NAME} найден, версия ${APP_VERSION}`);
        }
    }

    return store;
}

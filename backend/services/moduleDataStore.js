import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { moduleDataSeed } from '../data/moduleData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '..', 'data', 'moduleData.json');

async function ensureDataFile() {
    try {
        await fs.access(dataFilePath);
    } catch {
        await fs.writeFile(dataFilePath, JSON.stringify(moduleDataSeed, null, 2), 'utf-8');
    }
}

async function readData() {
    await ensureDataFile();
    const raw = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(raw);
}

async function writeData(data) {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export const moduleDataStore = {
    async getModule(moduleKey) {
        const data = await readData();
        return data[moduleKey] || null;
    },

    async addItem(moduleKey, collectionKey, item) {
        const data = await readData();
        const targetModule = data[moduleKey];

        if (!targetModule) {
            throw new Error(`Unknown module: ${moduleKey}`);
        }

        if (!Array.isArray(targetModule[collectionKey])) {
            throw new Error(`Collection '${collectionKey}' not found on module '${moduleKey}'`);
        }

        targetModule[collectionKey].unshift(item);
        await writeData(data);
        return item;
    }
};

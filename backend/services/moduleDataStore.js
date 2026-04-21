import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { moduleDataSeed } from '../data/moduleData.js';

const getDataFilePath = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, '..', 'data', 'moduleData.json');
};

const getSupabaseConfig = () => ({
    url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    key: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY
});

const collectionMap = {
    alerts: ['alerts'],
    logistics: ['transfers'],
    stockRebalancing: ['recommendations'],
    federatedLearning: ['edgeNodes', 'logs'],
    checkout: ['transactions'],
    vendorPortal: ['products', 'requests', 'requestActions', 'compliance', 'documents']
};

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function mergeVendorRequestActions(requests = [], actions = []) {
        if (!Array.isArray(requests) || requests.length === 0) return requests;
        if (!Array.isArray(actions) || actions.length === 0) return requests;

        const latestActionByRequestId = new Map();
        for (const action of actions) {
            if (!action?.requestId || latestActionByRequestId.has(action.requestId)) continue;
            latestActionByRequestId.set(action.requestId, action);
        }

        return requests.map((request) => {
            const latestAction = latestActionByRequestId.get(request.id);
            if (!latestAction) return request;

            return {
                ...request,
                status: latestAction.decision,
                decision: latestAction.decision,
                decisionNote: latestAction.note || '',
                reviewedAt: latestAction.actedAt || latestAction.created_at || latestAction.reviewedAt || null,
            };
        });
}

function upsertLocalItem(items = [], item = {}) {
    if (!Array.isArray(items)) return [item];
    const itemId = item?.id;
    if (!itemId) return [item, ...items];

    const existingIndex = items.findIndex((entry) => entry?.id === itemId);
    if (existingIndex === -1) {
        return [item, ...items];
    }

    const nextItems = [...items];
    nextItems[existingIndex] = { ...nextItems[existingIndex], ...item };
    return nextItems;
}

function isSupabaseConfigured() {
    const { url, key } = getSupabaseConfig();
    return Boolean(url && key);
}

async function supabaseRequest(endpoint, options = {}) {
    const { url: supabaseUrl, key: supabaseKey } = getSupabaseConfig();
    const url = `${supabaseUrl}/rest/v1/${endpoint}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Supabase error ${res.status}: ${text}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

async function getSupabaseItems(moduleKey, collectionKey, filters = {}) {
    if (!isSupabaseConfigured()) return [];

    let baseQuery = `module_records?module_key=eq.${encodeURIComponent(moduleKey)}&collection_key=eq.${encodeURIComponent(collectionKey)}&select=payload,created_at&order=created_at.desc`;
    
    // Apply filters at the database level for JSONB payload if present
    if (filters && Object.keys(filters).length > 0) {
        for (const [key, value] of Object.entries(filters)) {
            if (value && value !== 'all') {
                baseQuery += `&payload->>${encodeURIComponent(key)}=eq.${encodeURIComponent(value)}`;
            }
        }
    }

    try {
        const pageSize = 1000;
        let offset = 0;
        const items = [];

        // Supabase REST defaults to 1000 rows. Page through all rows so large datasets are fully available.
        while (true) {
            const query = `${baseQuery}&limit=${pageSize}&offset=${offset}`;
            const rows = await supabaseRequest(query, { method: 'GET' });
            if (!rows || rows.length === 0) break;

            items.push(...rows.map((r) => r.payload));

            if (rows.length < pageSize) break;
            offset += pageSize;
        }

        return items;
    } catch (error) {
        console.error(`Supabase fetch failed for ${collectionKey}:`, error.message);
        throw error; // Let getModule catch this and fall back to local
    }
}

async function addSupabaseItem(moduleKey, collectionKey, item) {
    if (!isSupabaseConfigured()) return null;

    const payload = {
        module_key: moduleKey,
        collection_key: collectionKey,
        item_id: item?.id || `${Date.now()}`,
        payload: item
    };

    await supabaseRequest('module_records?on_conflict=module_key,collection_key,item_id', {
        method: 'POST',
        headers: {
            Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(payload)
    });

    return item;
}

async function updateSupabaseItem(moduleKey, collectionKey, itemId, item) {
    if (!isSupabaseConfigured()) return null;

    const payload = {
        module_key: moduleKey,
        collection_key: collectionKey,
        item_id: itemId,
        payload: item
    };

    await supabaseRequest(`module_records?module_key=eq.${encodeURIComponent(moduleKey)}&collection_key=eq.${encodeURIComponent(collectionKey)}&item_id=eq.${encodeURIComponent(itemId)}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });

    return item;
}

async function ensureDataFile() {
    const dataFilePath = getDataFilePath();
    try {
        await fs.access(dataFilePath);
    } catch {
        await fs.writeFile(dataFilePath, JSON.stringify(moduleDataSeed, null, 2), 'utf-8');
    }
}

async function readData() {
    const dataFilePath = getDataFilePath();
    await ensureDataFile();
    const raw = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(raw);
}

async function writeData(data) {
    const dataFilePath = getDataFilePath();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export const moduleDataStore = {
    isSupabaseConfigured,
    async getModule(moduleKey, filters = {}) {
        // Fallback for cases where the server hasn't been restarted to pick up new seed data
        let seed = moduleDataSeed[moduleKey];
        if (!seed && moduleKey === 'checkout') {
            seed = {
                kpis: [
                    { label: 'Today Total Sales', value: 'Rs. 4,250.00', trend: '+12%', status: 'success', icon: 'ShoppingCart' },
                    { label: 'Transactions', value: '142', trend: '+5', status: 'neutral', icon: 'Clock' },
                    { label: 'Avg Basket Size', value: 'Rs. 29.93', trend: '+1.5%', status: 'success', icon: 'Package' },
                    { label: 'System Accuracy', value: '98.5%', trend: '+0.2%', status: 'success', icon: 'ShieldCheck' },
                ],
                transactions: []
            };
        }

        if (!seed) return null;

        const result = clone(seed);
        const collections = collectionMap[moduleKey] || [];

        for (const collectionKey of collections) {
            try {
                let remoteItems = await getSupabaseItems(moduleKey, collectionKey, filters);
                
                // Keep the in-memory filtering as a secondary safety check, 
                // but primarily it now filters at the DB level for better performance and to bypass row limits.
                if (remoteItems.length > 0) {
                    result[collectionKey] = remoteItems;
                } else {
                    throw new Error('No remote items found; triggering local fallback');
                }
            } catch (error) {
                try {
                    const local = await readData();
                    const localItems = local?.[moduleKey]?.[collectionKey] || [];
                    if (localItems.length > 0) {
                        let filteredLocal = localItems;
                        
                            filteredLocal = filteredLocal.filter((item, idx) => {
                                return Object.entries(filters).every(([key, value]) => {
                                    if (!value || value === 'all') return true;
                                    const itemValue = item[key];
                                    return String(itemValue).toLowerCase().trim() === String(value).toLowerCase().trim();
                                });
                            });
                        
                        result[collectionKey] = filteredLocal;
                    }
                } catch (e) {
                    // Ignore read errors
                }
            }
        }
        
        // Final fail-safe: Filter EVERY collection in the result based on the provided filters
        if (filters && Object.keys(filters).length > 0) {
            for (const collectionKey of (collectionMap[moduleKey] || [])) {
                if (Array.isArray(result[collectionKey])) {
                    result[collectionKey] = result[collectionKey].filter(item => {
                        return Object.entries(filters).every(([key, value]) => {
                            if (!value || value === 'all') return true;
                            // Check item property or nested property if needed
                            const itemValue = item[key];
                            if (itemValue === undefined) return true; // Don't filter out if property missing
                            return String(itemValue).toLowerCase().trim() === String(value).toLowerCase().trim();
                        });
                    });
                }
            }
        }

        // Also sync the summary if available in local data
        try {
            const local = await readData();
            if (local?.[moduleKey]?.summary) {
                result.summary = local[moduleKey].summary;
            }
        } catch (e) {}

        if (moduleKey === 'vendorPortal' && Array.isArray(result.requests) && Array.isArray(result.requestActions)) {
            result.requests = mergeVendorRequestActions(result.requests, result.requestActions);
        }

        return result;
    },

    async addItem(moduleKey, collectionKey, item) {
        let seed = moduleDataSeed[moduleKey];
        
        // Dynamic check for checkout module
        if (!seed && moduleKey === 'checkout') {
            seed = { transactions: [] };
        }

        if (!seed) throw new Error(`Unknown module: ${moduleKey}`);
        
        // Ensure collection exists even if not in seed
        if (!Array.isArray(seed[collectionKey]) && collectionKey === 'transactions' && moduleKey === 'checkout') {
            seed[collectionKey] = [];
        }

        if (!Array.isArray(seed[collectionKey])) {
            throw new Error(`Collection '${collectionKey}' not found on module '${moduleKey}'`);
        }

        if (isSupabaseConfigured()) {
            try {
                await addSupabaseItem(moduleKey, collectionKey, item);
                return item;
            } catch (error) {
                throw new Error(
                    `${error.message}. Run SQL from backend/database/create_module_records_table.sql in Supabase and verify RLS policies.`
                );
            }
        }

        // Fallback for local-only development when Supabase env is not set
        const data = await readData();
        const targetModule = data[moduleKey] || {};
        if (!Array.isArray(targetModule[collectionKey])) targetModule[collectionKey] = [];
        targetModule[collectionKey] = upsertLocalItem(targetModule[collectionKey], item);
        data[moduleKey] = targetModule;
        await writeData(data);
        return item;
    },

    async updateItem(moduleKey, collectionKey, itemId, item) {
        let seed = moduleDataSeed[moduleKey];

        if (!seed && moduleKey === 'checkout') {
            seed = { transactions: [] };
        }

        if (!seed) throw new Error(`Unknown module: ${moduleKey}`);

        if (!Array.isArray(seed[collectionKey])) {
            throw new Error(`Collection '${collectionKey}' not found on module '${moduleKey}'`);
        }

        if (isSupabaseConfigured()) {
            try {
                await updateSupabaseItem(moduleKey, collectionKey, itemId, item);
                return item;
            } catch (error) {
                throw new Error(
                    `${error.message}. Run SQL from backend/database/create_module_records_table.sql in Supabase and verify RLS policies.`
                );
            }
        }

        const data = await readData();
        const targetModule = data[moduleKey] || {};
        if (!Array.isArray(targetModule[collectionKey])) targetModule[collectionKey] = [];
        const existingIndex = targetModule[collectionKey].findIndex((entry) => entry?.id === itemId);
        if (existingIndex >= 0) {
            targetModule[collectionKey][existingIndex] = { ...targetModule[collectionKey][existingIndex], ...item };
        } else {
            targetModule[collectionKey].unshift(item);
        }
        data[moduleKey] = targetModule;
        await writeData(data);
        return item;
    }
};

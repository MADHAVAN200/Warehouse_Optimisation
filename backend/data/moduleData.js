export const moduleDataSeed = {
    alerts: {
        kpis: {
            avgResponseTime: '8m',
        },
        alerts: [
            {
                id: 'ALT-2024-001',
                priority: 'Critical',
                type: 'Inventory',
                source: 'Inventory Risk',
                description: 'Imminent stockout for Avocados (Hass) at Store #402. Safety stock breached.',
                store: 'Store 402',
                time: '10m ago',
                sla: '15m remaining',
                status: 'New',
                owner: 'Unassigned',
                rootCause: ['Demand spike (+40%)', 'Late delivery'],
                recommendation: 'Initiate emergency replenishment from Warehouse B.'
            },
            {
                id: 'ALT-2024-002',
                priority: 'High',
                type: 'Model/System',
                source: 'Model Health',
                description: 'Vision Model accuracy dropped by 1.5% in the last hour.',
                store: 'Global',
                time: '45m ago',
                sla: '2h remaining',
                status: 'In Progress',
                owner: 'Sarah J. (AI Ops)',
                rootCause: ['Lighting condition change', 'New packaging detected'],
                recommendation: 'Trigger localized retraining for affected cameras.'
            },
            {
                id: 'ALT-2024-003',
                priority: 'High',
                type: 'Checkout',
                source: 'Live Monitoring',
                description: 'Repeated lane anomalies at Lane 03. Possible camera obstruction.',
                store: 'Store 115',
                time: '1h ago',
                sla: 'Overdue',
                status: 'New',
                owner: 'Unassigned',
                rootCause: ['Camera occlusion', 'Sensor noise'],
                recommendation: 'Dispatch floor staff to inspect Lane 03.'
            },
            {
                id: 'ALT-2024-004',
                priority: 'Medium',
                type: 'Forecast',
                source: 'Demand Engine',
                description: 'Forecast volatility exceeds threshold due to unmapped local event.',
                store: 'Store 892',
                time: '3h ago',
                sla: '4h remaining',
                status: 'Acknowledged',
                owner: 'Mike R.',
                rootCause: ['Event detection lag', 'Weather shift'],
                recommendation: 'Review event parameters in Scenario Planner.'
            }
        ]
    },
    logistics: {
        kpis: [
            { label: 'Active Transfers', value: '42', trend: '+5', status: 'neutral', icon: 'Truck' },
            { label: 'In-Transit', value: '28', trend: '+12', status: 'neutral', icon: 'Activity' },
            { label: 'Delayed', value: '3', trend: '-2', status: 'critical', icon: 'AlertTriangle' },
            { label: 'At Risk', value: '5', trend: '+1', status: 'warning', icon: 'ShieldAlert' },
        ],
        transfers: [
            {
                id: 'TRF-2024-001',
                sku: 'APP-ORG-001',
                product: 'Organic Honeycrisp Apples',
                qty: 500,
                unit: 'kg',
                source: 'DC-North (Warehouse)',
                destination: 'Store #104 (Downtown)',
                type: 'Warehouse -> Store',
                status: 'In Transit',
                eta: 'Today, 14:00',
                sla_status: 'On Track',
                cold_chain: true,
                risk_level: 'Low',
                events: [
                    { time: '10:00 AM', event: 'Departed DC-North', location: 'Seattle, WA' },
                    { time: '08:30 AM', event: 'Loaded via Dock 4', location: 'Seattle, WA' },
                ]
            },
            {
                id: 'TRF-2024-002',
                sku: 'DAI-MLK-202',
                product: 'Whole Milk 2L',
                qty: 200,
                unit: 'units',
                source: 'Store #201 (Westside)',
                destination: 'Store #104 (Downtown)',
                type: 'Inter-store',
                status: 'Delayed',
                eta: 'Today, 18:30',
                sla_status: 'At Risk',
                cold_chain: true,
                risk_level: 'High',
                events: [
                    { time: '11:15 AM', event: 'Delay Alert: Traffic Congestion', location: 'I-5 South' },
                    { time: '09:45 AM', event: 'Departed Store #201', location: 'Portland, OR' }
                ]
            },
            {
                id: 'TRF-2024-005',
                sku: 'FRZ-IC-505',
                product: 'Vanilla Bean Ice Cream',
                qty: 50,
                unit: 'cases',
                source: 'DC-ColdStorage',
                destination: 'Store #102 (Northgate)',
                type: 'Warehouse -> Store',
                status: 'In Transit',
                eta: 'Today, 15:45',
                sla_status: 'Critical',
                cold_chain: true,
                risk_level: 'Critical',
                risk_reason: 'Temp Fluctuation',
                events: [
                    { time: '12:30 PM', event: 'Temp Alert: +4C variance', location: 'En route' },
                    { time: '11:00 AM', event: 'Departed Cold Storage', location: 'Tacoma, WA' }
                ]
            }
        ]
    },
    stockRebalancing: {
        summary: {
            excessStockUnits: 2450,
            spoilageRisk: 'High',
            lowDemandConfidence: '42%',
            insight: 'Store 402 has a surplus of perishable goods due to a cancelled local event. Store 115 is facing shortages for the same items.'
        },
        recommendations: [
            {
                id: 'TRF-2024-882',
                sku: 'Avocados (Hass) - Premium',
                skuId: 'SKU-9928',
                sourceStore: 'Store 402 (North)',
                destStore: 'Store 115 (Downtown)',
                marketingName: 'Organic Hass Avocados',
                qty: 150,
                unit: 'Units',
                demandGap: '+420 Units',
                riskReduction: 'High',
                priority: 'Critical',
                confidence: 96,
                distance: '12 miles',
                time: '45 mins',
                feasibility: 'Feasible',
                coldChain: true,
                sourceMetrics: {
                    overstock: 'Severe (+200%)',
                    spoilageRisk: 'High (<3 days)',
                    forecast: 'Declining'
                },
                destMetrics: {
                    stockoutRisk: 'Imminent (2h)',
                    forecast: 'Spiking (+50%)',
                    promoActive: true
                }
            },
            {
                id: 'TRF-2024-885',
                sku: 'Almond Milk - Unsweetened',
                skuId: 'SKU-1029',
                sourceStore: 'Store 892 (West)',
                destStore: 'Store 402 (North)',
                marketingName: 'Silk Almond Milk',
                qty: 40,
                unit: 'Cartons',
                demandGap: '+65 Units',
                riskReduction: 'Medium',
                priority: 'High',
                confidence: 88,
                distance: '8 miles',
                time: '30 mins',
                feasibility: 'Feasible',
                coldChain: false,
                sourceMetrics: {
                    overstock: 'Moderate (+40%)',
                    spoilageRisk: 'Low',
                    forecast: 'Flat'
                },
                destMetrics: {
                    stockoutRisk: 'Medium (24h)',
                    forecast: 'Stable',
                    promoActive: false
                }
            }
        ]
    },
    federatedLearning: {
        globalAccuracy: [
            { round: 'R-104', accuracy: 90.5, loss: 0.38 },
            { round: 'R-105', accuracy: 91.2, loss: 0.35 },
            { round: 'R-106', accuracy: 91.8, loss: 0.33 },
            { round: 'R-107', accuracy: 92.4, loss: 0.31 },
            { round: 'R-108', accuracy: 93.1, loss: 0.28 },
        ],
        edgeNodes: [
            { id: 'STORE-402', status: 'Training', round: 108, accuracy: 94.2, weight: 1.2, drift: 'Low', lastUpdate: '2m ago' },
            { id: 'STORE-115', status: 'Ready', round: 108, accuracy: 92.8, weight: 1.0, drift: 'Low', lastUpdate: '5m ago' },
            { id: 'STORE-892', status: 'Idle', round: 107, accuracy: 89.5, weight: 0.9, drift: 'Medium', lastUpdate: '1h ago' },
            { id: 'STORE-055', status: 'Error', round: 106, accuracy: 0.0, weight: 0.0, drift: 'High', lastUpdate: '4h ago' },
        ],
        logs: [
            { id: 1, time: '10:45:00', event: 'Global Aggregation R-108 started', type: 'info' },
            { id: 2, time: '10:44:22', event: 'Store-402 submitted local gradients (Size: 45MB)', type: 'success' },
            { id: 3, time: '10:30:15', event: 'Store-055 connection timeout - dropped from round', type: 'error' }
        ]
    },
    checkout: {
        kpis: [
            { label: 'Total Daily Revenue', value: 'Rs. 58,420.00', trend: '+12.5%', status: 'success', icon: 'ShoppingCart' },
            { label: 'Total Transactions', value: '284', trend: '+18', status: 'success', icon: 'Clock' },
            { label: 'Avg Basket Size', value: 'Rs. 205.70', trend: '+3.2%', status: 'success', icon: 'Package' },
            { label: 'System Accuracy', value: '99.2%', trend: '+0.1%', status: 'success', icon: 'ShieldCheck' },
        ],
        transactions: [
            // Lane 01 (Express)
            { id: 'TXN-EX-101', lane: 'Lane 01', customer: 'John Doe', timestamp: '2026-03-23 10:15:22', items: [{ name: 'Milk', qty: 1, price: 45 }, { name: 'Bread', qty: 1, price: 30 }], subtotal: 75, tax: 13.5, total: 88.5, paymentMethod: 'UPI', status: 'Completed' },
            { id: 'TXN-EX-102', lane: 'Lane 01', customer: 'Guest #992', timestamp: '2026-03-23 10:18:45', items: [{ name: 'Coke 500ml', qty: 2, price: 40 }], subtotal: 80, tax: 14.4, total: 94.4, paymentMethod: 'Cash', status: 'Completed' },
            { id: 'TXN-EX-105', lane: 'Lane 01', customer: 'Guest #105', timestamp: '2026-03-23 12:05:00', items: [{ name: 'Snickers', qty: 5, price: 40 }], subtotal: 200, tax: 36, total: 236, paymentMethod: 'Cash', status: 'Completed' },
            
            // Lane 04 (Regular)
            { id: 'TXN-RG-401', lane: 'Lane 04', customer: 'Alice Wong', timestamp: '2026-03-23 11:05:12', items: [{ name: 'Rice 5kg', qty: 1, price: 450 }, { name: 'Dal 1kg', qty: 2, price: 120 }, { name: 'Oil 1L', qty: 1, price: 180 }], subtotal: 870, tax: 156.6, total: 1026.6, paymentMethod: 'Card', status: 'Completed' },
            { id: 'TXN-RG-404', lane: 'Lane 04', customer: 'Mark Greene', timestamp: '2026-03-23 11:45:00', items: [{ name: 'Pasta', qty: 3, price: 85 }, { name: 'Sauce', qty: 2, price: 120 }, { name: 'Cheese', qty: 1, price: 250 }], subtotal: 745, tax: 134.1, total: 879.1, paymentMethod: 'UPI', status: 'Completed' },
            
            // Lane 07 (Bulk)
            { id: 'TXN-BK-701', lane: 'Lane 07', customer: 'Hotel Grand', timestamp: '2026-03-23 09:30:00', items: [{ name: 'Sugar 50kg', qty: 2, price: 2200 }, { name: 'Flour 50kg', qty: 2, price: 1800 }], subtotal: 8000, tax: 1440, total: 9440, paymentMethod: 'Bank Transfer', status: 'Completed' },
            { id: 'TXN-BK-703', lane: 'Lane 07', customer: 'City Hospital', timestamp: '2026-03-23 15:10:00', items: [{ name: 'Disinfectant 20L', qty: 5, price: 1200 }, { name: 'Hand Wash 5L', qty: 10, price: 600 }], subtotal: 12000, tax: 2160, total: 14160, paymentMethod: 'Card', status: 'Completed' },
            
            // Generic mix
            { id: 'TXN-001', lane: 'Lane 02', customer: 'Guest #4102', timestamp: '2026-03-23 14:20:00', items: [{ name: 'Apples', qty: 2, price: 45.00 }, { name: 'Milk 2L', qty: 1, price: 28.50 }], subtotal: 118.50, tax: 21.33, total: 139.83, paymentMethod: 'Card', status: 'Completed' },
            { id: 'TXN-002', lane: 'Lane 03', customer: 'Guest #8812', timestamp: '2026-03-23 15:05:00', items: [{ name: 'Avocados', qty: 4, price: 35.00 }], subtotal: 140.00, tax: 25.20, total: 165.20, paymentMethod: 'UPI', status: 'Completed' },
            { id: 'TXN-003', lane: 'Lane 05', customer: 'Guest #1029', timestamp: '2026-03-23 15:15:00', items: [{ name: 'Bread', qty: 1, price: 22.00 }, { name: 'Soup Can', qty: 3, price: 12.50 }], subtotal: 59.50, tax: 10.71, total: 70.21, paymentMethod: 'Cash', status: 'Completed' },
            { id: 'TXN-004', lane: 'Lane 06', customer: 'Guest #5521', timestamp: '2026-03-23 15:45:00', items: [{ name: 'Rice 5kg', qty: 1, price: 150.00 }, { name: 'Oil 1L', qty: 2, price: 18.00 }], subtotal: 186.00, tax: 33.48, total: 219.48, paymentMethod: 'Card', status: 'Completed' },
            { id: 'TXN-005', lane: 'Lane 08', customer: 'Guest #3301', timestamp: '2026-03-23 16:00:00', items: [{ name: 'Body Wash', qty: 1, price: 42.00 }, { name: 'Coke 1.25L', qty: 2, price: 18.00 }], subtotal: 78.00, tax: 14.04, total: 92.04, paymentMethod: 'Card', status: 'Completed' }
        ]
    }
};

export const moduleData = moduleDataSeed;

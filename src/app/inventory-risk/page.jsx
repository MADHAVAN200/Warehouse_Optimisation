
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle, TrendingDown, TrendingUp, Package, ArrowRight,
    Activity, Filter, Truck, Thermometer, Calendar, Layers,
    Zap, AlertOctagon, MoreHorizontal, ShieldAlert, CheckCircle2
} from 'lucide-react';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label
} from 'recharts';

// --- MOCK DATA ---

const KPIS = [
    { title: "Critical SKUs", value: "12", sub: "Review Immediately", icon: AlertTriangle, color: "text-red-500", border: "border-red-500/50" },
    { title: "Shortage Risks", value: "8", sub: "Potential Stockouts", icon: TrendingDown, color: "text-orange-500", border: "border-orange-500/50" },
    { title: "Overstock Risks", value: "5", sub: "Capital Tied Up", icon: Package, color: "text-yellow-500", border: "border-yellow-500/50" },
    { title: "Spoilage Risk", value: "3", sub: "Expiring < 48h", icon: Thermometer, color: "text-purple-500", border: "border-purple-500/50" },
];

const RISK_MATRIX_DATA = [
    { id: 1, name: "Cola 12pk", demand: 95, inventory: 15, risk: "Shortage", severity: "Critical", size: 400 },
    { id: 2, name: "Chips Lg", demand: 88, inventory: 20, risk: "Shortage", severity: "High", size: 300 },
    { id: 3, name: "Water 24pk", demand: 85, inventory: 90, risk: "Balanced", severity: "Low", size: 100 },
    { id: 4, name: "Energy Drink", demand: 20, inventory: 95, risk: "Overstock", severity: "High", size: 350 },
    { id: 5, name: "Seasonal Candy", demand: 15, inventory: 80, risk: "Overstock", severity: "Medium", size: 250 },
    { id: 6, name: "Fresh Berries", demand: 60, inventory: 65, risk: "Spoilage", severity: "Critical", size: 380 },
    { id: 7, name: "Milk 1G", demand: 90, inventory: 85, risk: "Balanced", severity: "Low", size: 120 },
    { id: 8, name: "Bread Loaf", demand: 75, inventory: 30, risk: "Shortage", severity: "Medium", size: 200 },
    { id: 9, name: "Ice Cream", demand: 10, inventory: 15, risk: "Watchlist", severity: "Low", size: 80 },
    { id: 10, name: "Pasta Sauce", demand: 45, inventory: 48, risk: "Balanced", severity: "Low", size: 90 },
];

const CRITICAL_QUEUE = [
    { id: 1, sku: "SKU-101 (Cola 12pk)", store: "Store #402", risk: "Shortage", severity: "Critical", impact: "< 24 Hours", confidence: "98%", driver: "Event Surge", action: "Expedite Transfer" },
    { id: 6, sku: "SKU-890 (Berries)", store: "Store #402", risk: "Spoilage", severity: "Critical", impact: "< 48 Hours", confidence: "95%", driver: "Weather Heat", action: "Markdown 20%" },
    { id: 2, sku: "SKU-205 (Chips Lg)", store: "Store #402", risk: "Shortage", severity: "High", impact: "2 Days", confidence: "92%", driver: "Trend Spike", action: "Adjust Order" },
    { id: 4, sku: "SKU-550 (Energy)", store: "Store #402", risk: "Overstock", severity: "High", impact: "Ongoing", confidence: "88%", driver: "Demand Drop", action: "Cancel Inbound" },
];

const DRIVERS = [
    { label: "Forecast Surge", value: 45, color: "bg-blue-500" },
    { label: "Event Overlap", value: 30, color: "bg-purple-500" },
    { label: "Supply Delay", value: 15, color: "bg-orange-500" },
    { label: "Weather", value: 10, color: "bg-green-500" },
];

// --- COMPONENT ---

const InventoryRiskPage = () => {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState("New York");
    const [riskFilter, setRiskFilter] = useState("all");
    const [selectedSku, setSelectedSku] = useState(null);

    // Helpers
    const getRiskColor = (risk) => {
        switch (risk) {
            case "Shortage": return "#f97316"; // Orange
            case "Overstock": return "#eab308"; // Yellow
            case "Spoilage": return "#a855f7"; // Purple
            case "Balanced": return "#22c55e"; // Green
            default: return "#6b7280"; // Gray
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground pb-20 font-sans">

            {/* 1. HEADER & GLOBAL FILTERS */}
            <div className="sticky top-0 z-30 bg-[#111] border-b border-[#222] shadow-lg">
                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="flex items-center space-x-3">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Inventory Risk Dashboard</h1>
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Execution Mode • Store #402</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Scope Selectors */}
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger className="w-[160px] h-9 bg-[#1a1a1a] border-[#333] text-gray-200 text-xs shadow-inner">
                                <SelectValue placeholder="City" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="New York">New York</SelectItem>
                                <SelectItem value="Austin">Austin</SelectItem>
                            </SelectContent>
                        </Select>

                        <ToggleGroup type="single" value={riskFilter} onValueChange={(val) => val && setRiskFilter(val)} className="bg-[#1a1a1a] border border-[#333] rounded-md p-0.5">
                            <ToggleGroupItem value="all" className="h-8 px-3 text-xs text-gray-400 data-[state=on]:bg-gray-800 data-[state=on]:text-white">Combined</ToggleGroupItem>
                            <ToggleGroupItem value="shortage" className="h-8 px-3 text-xs text-gray-400 data-[state=on]:bg-orange-900/40 data-[state=on]:text-orange-400">Shortage</ToggleGroupItem>
                            <ToggleGroupItem value="overstock" className="h-8 px-3 text-xs text-gray-400 data-[state=on]:bg-yellow-900/40 data-[state=on]:text-yellow-400">Overstock</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
            </div>

            <div className="p-6 w-full space-y-6">

                {/* 2. RISK POSTURE SUMMARY (KPIs) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {KPIS.map((kpi, idx) => {
                        const Icon = kpi.icon;
                        return (
                            <Card key={idx} className={`bg-[#111] border-l-4 ${kpi.border} border-y-[#222] border-r-[#222]`}>
                                <CardContent className="pt-6 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{kpi.title}</div>
                                            <div className="text-3xl font-bold text-white">{kpi.value}</div>
                                            <div className={`text-xs mt-1 ${kpi.color} font-medium`}>{kpi.sub}</div>
                                        </div>
                                        <div className={`p-2 rounded-lg bg-[#1a1a1a] ${kpi.color.replace('text-', 'text-opacity-80 ')}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] lg:h-[550px]">

                    {/* 3. INVENTORY RISK MATRIX (Main Viz) */}
                    <Card className="lg:col-span-2 bg-[#111] border-[#333] flex flex-col">
                        <CardHeader className="pb-2 border-b border-[#222]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-white text-lg">Risk Matrix</CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Categorizing inventory by Demand Strength (X) vs. Availability (Y)
                                    </CardDescription>
                                </div>
                                <div className="flex gap-4 text-xs">
                                    <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>Shortage</div>
                                    <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>Overstock</div>
                                    <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>Spoilage</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                    <XAxis type="number" dataKey="demand" name="Demand" stroke="#555" fontSize={12} domain={[0, 100]} label={{ value: 'Forecasted Demand (High →)', position: 'insideBottomRight', offset: -10, fill: '#666', fontSize: 10 }} />
                                    <YAxis type="number" dataKey="inventory" name="Inventory" stroke="#555" fontSize={12} domain={[0, 100]} label={{ value: 'Available Inventory (High ↑)', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 10 }} />
                                    <Tooltip
                                        cursor={{ strokeDasharray: '3 3' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-[#1a1a1a] border border-[#333] p-3 rounded shadow-xl">
                                                        <div className="font-bold text-white mb-1">{data.name}</div>
                                                        <div className="text-xs text-gray-400">Risk: <span style={{ color: getRiskColor(data.risk) }}>{data.risk}</span></div>
                                                        <div className="text-xs text-gray-500 mt-1">Inv: {data.inventory} | Dem: {data.demand}</div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <ReferenceLine x={50} stroke="#333" />
                                    <ReferenceLine y={50} stroke="#333" />
                                    {/* Labels for Quadrants */}
                                    <ReferenceLine x={90} label={{ position: 'top', value: 'Shortage Zone', fill: '#f97316', fontSize: 10 }} stroke="none" />
                                    <ReferenceLine y={90} label={{ position: 'right', value: 'Overstock Zone', fill: '#eab308', fontSize: 10 }} stroke="none" />

                                    <Scatter name="SKUs" data={RISK_MATRIX_DATA} shape="circle">
                                        {RISK_MATRIX_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} strokeWidth={0} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 5. DRIVERS & CONTEXT */}
                    <div className="space-y-6 flex flex-col h-full">
                        <Card className="bg-[#111] border-[#333] flex-1">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white text-base">Risk Drivers</CardTitle>
                                <CardDescription className="text-xs text-gray-500">Why are these SKUs at risk?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {DRIVERS.map((d, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>{d.label}</span>
                                            <span>{d.value}%</span>
                                        </div>
                                        <div className="w-full bg-[#222] rounded-full h-2">
                                            <div className={`h-2 rounded-full ${d.color}`} style={{ width: `${d.value}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                                <div className="bg-[#1a1a1a] p-3 rounded border border-[#333] mt-4">
                                    <div className="text-xs text-gray-400 leading-relaxed">
                                        Major shortage pressure driven by <span className="text-blue-400 font-medium">unforeseen forecast surge (45%)</span> and recent event overlaps.
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#151515] border border-blue-900/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-blue-400 flex items-center">
                                    <Zap className="w-4 h-4 mr-2" />
                                    AI Recommendation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-xs text-gray-300 mb-3">
                                    Transfer <span className="text-white font-bold">150 units</span> of Cola from Store #405 (Overstocked) to mitigate critical shortage here.
                                </p>
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs" onClick={() => navigate('/logistics')}>
                                    Execute Transfer
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 4. CRITICAL SKU QUEUE */}
                <Card className="bg-[#111] border-[#333]">
                    <CardHeader className="py-4 border-b border-[#222]">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-lg">Critical SKU Actions</CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs text-gray-400 h-8">
                                View Full List <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-[#222] hover:bg-transparent">
                                    <TableHead className="text-gray-400 h-10 w-[200px]">SKU / Product</TableHead>
                                    <TableHead className="text-gray-400 h-10">Risk Type</TableHead>
                                    <TableHead className="text-gray-400 h-10">Urgency</TableHead>
                                    <TableHead className="text-gray-400 h-10">Driver</TableHead>
                                    <TableHead className="text-gray-400 h-10">Rec. Action</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {CRITICAL_QUEUE.map((row) => (
                                    <TableRow key={row.id} className="border-[#222] hover:bg-[#1a1a1a] group">
                                        <TableCell className="font-medium text-white py-3">{row.sku}</TableCell>
                                        <TableCell className="py-3">
                                            <Badge variant="outline" className={`
                                                ${row.risk === 'Shortage' ? 'text-orange-400 border-orange-900 bg-orange-900/10' :
                                                    row.risk === 'Overstock' ? 'text-yellow-400 border-yellow-900 bg-yellow-900/10' :
                                                        row.risk === 'Spoilage' ? 'text-purple-400 border-purple-900 bg-purple-900/10' : 'text-gray-400'}
                                            `}>
                                                {row.risk}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-300 text-sm py-3">
                                            <div className="flex items-center space-x-2">
                                                <span className={`${row.severity === 'Critical' ? 'text-red-500 font-bold' : 'text-yellow-500'}`}>{row.impact}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-400 text-sm py-3">{row.driver}</TableCell>
                                        <TableCell className="py-3">
                                            <span className="text-blue-400 text-sm hover:underline cursor-pointer">{row.action}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* 6. CROSS MODULE CONTEXT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#222] mt-8">
                    <div
                        onClick={() => navigate('/forecast-engine')}
                        className="group flex flex-col p-4 rounded-xl border border-[#222] bg-[#111] hover:border-blue-500/30 cursor-pointer transition-all"
                    >
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 group-hover:text-blue-400">Deep Dive</div>
                        <div className="text-lg font-bold text-white flex items-center">
                            Forecast Engine <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Check baseline demand accuracy</div>
                    </div>

                    <div
                        onClick={() => navigate('/event-intelligence')}
                        className="group flex flex-col p-4 rounded-xl border border-[#222] bg-[#111] hover:border-purple-500/30 cursor-pointer transition-all"
                    >
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 group-hover:text-purple-400">Context</div>
                        <div className="text-lg font-bold text-white flex items-center">
                            Event Intelligence <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Verify event-driven spikes</div>
                    </div>

                    <div
                        onClick={() => navigate('/scenario-planning')}
                        className="group flex flex-col p-4 rounded-xl border border-[#222] bg-[#111] hover:border-green-500/30 cursor-pointer transition-all"
                    >
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 group-hover:text-green-400">Simulation</div>
                        <div className="text-lg font-bold text-white flex items-center">
                            Run Scenario <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Test replenishment strategies</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InventoryRiskPage;

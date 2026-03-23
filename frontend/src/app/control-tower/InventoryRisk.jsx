
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AlertTriangle, TrendingDown, TrendingUp, Package, ArrowRight,
    Activity, Filter, Truck, Thermometer, Calendar as CalendarIcon, Layers,
    Zap, AlertOctagon, MoreHorizontal, ShieldAlert, CheckCircle2, Home
} from 'lucide-react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label,
    PieChart, Pie, Legend
} from 'recharts';
import {
    Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbPage, BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

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

import { inventoryService } from '@/services/inventoryService';
import { weatherService } from '@/services/weatherService';
import { masterDataService } from '@/services/masterDataService';

const InventoryRiskPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fromControlTower = queryParams.get('from') === 'control-tower';

    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [riskFilter, setRiskFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [risks, setRisks] = useState([]);
    const [stats, setStats] = useState({ critical: 0, shortage: 0, overstock: 0, spoilage: 0, avgConfidence: 0 });

    // Master data
    const [locations, setLocations] = useState([]);

    const loadMasterData = async () => {
        try {
            // User considers 'cities' as regions for this view
            const locData = await masterDataService.getCities();
            setLocations(locData);

            // Initialize selection if it is empty and data is available
            if (locData.length > 0 && !selectedLocation) setSelectedLocation(locData[0].city_id);
        } catch (err) {
            console.error("Error loading master data:", err);
        }
    };

    const fetchInventoryRisks = async () => {
        // Prevent fetching if master data hasn't initialized selections yet
        if (!selectedLocation) return;
        
        setLoading(true);
        try {
            // 1. Fetch Inventory Risks with filters (mapping selected location to cityId and matching date)
            const data = await inventoryService.getInventoryRisksFiltered({
                cityId: selectedLocation,
                date: selectedDate || 'all'
            });

            // 2. Fetch Regional Weather Impact (simplified for now as it was city-specific)
            // we'll skip weather impact for region-level view for simplicity, or we could aggregate
            // setWeatherImpact(null);

            // 3. Map to UI format
            const mappedRisks = data.map(r => ({
                id: r.risk_id,
                sku: `${r.products?.product_name || 'Unknown SKU'}`,
                risk: r.risk_type,
                severity: r.severity_level,
                driver: r.driver_reason,
                impact: r.impact_timeframe || (r.severity_level === 'High' ? '< 24 Hours' : '3-5 Days'),
                confidence: `${r.confidence_pct}%`,
                store: r.stores?.store_name || 'Generic Warehouse',
                city: r.stores?.cities?.city_name || 'Regional',
                confidenceNum: parseFloat(r.confidence_pct),
                currentQty: r.current_qty || 0,
                expectedQty: r.expected_qty || 0,
                insight: r.ai_insight || 'Monitor closely.'
            }));

            setRisks(mappedRisks);

            // 4. Aggregate Stats
            const criticalCount = mappedRisks.filter(r => r.severity === 'High' || r.severity === 'Critical').length;
            const avgConf = mappedRisks.length > 0 
                ? mappedRisks.reduce((acc, curr) => acc + curr.confidenceNum, 0) / mappedRisks.length 
                : 0;

            setStats({
                critical: criticalCount,
                shortage: mappedRisks.filter(r => r.risk === 'Shortage').length,
                overstock: mappedRisks.filter(r => r.risk === 'Overstock').length,
                spoilage: mappedRisks.filter(r => r.risk === 'Spoilage').length,
                avgConfidence: avgConf.toFixed(1)
            });

        } catch (err) {
            console.error("Risk fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadMasterData();
    }, []);

    React.useEffect(() => {
        fetchInventoryRisks();
    }, [selectedLocation, selectedDate]);

    const KPIS = [
        { title: "Critical Risks", value: stats.critical, sub: "Review Immediately", icon: AlertTriangle, color: "text-red-500", border: "border-red-500/50" },
        { title: "Shortage Risks", value: stats.shortage, sub: "Potential Stockouts", icon: TrendingDown, color: "text-orange-500", border: "border-orange-500/50" },
        { title: "Overstock Risks", value: stats.overstock, sub: "Capital Tied Up", icon: Package, color: "text-yellow-500", border: "border-yellow-500/50" },
        { title: "AI Confidence", value: `${stats.avgConfidence}%`, sub: "Model Reliability", icon: ShieldAlert, color: "text-blue-500", border: "border-blue-500/50" },
    ];

    const getRiskColor = (risk) => {
        switch (risk) {
            case "Shortage": return "#f97316";
            case "Overstock": return "#eab308";
            case "Spoilage": return "#a855f7";
            case "Demand Volatility": return "#3b82f6";
            default: return "#6b7280";
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground pb-20 font-sans">
            {/* 1. HEADER & GLOBAL FILTERS */}
            <div className="sticky top-0 z-30 bg-[#111] border-b border-[#222] shadow-lg">
                {/* Breadcrumb Section */}
                <div className="px-6 pt-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-1 text-gray-500 hover:text-blue-400 cursor-pointer text-[11px] transition-colors"
                                >
                                    <Home className="w-3 h-3" />
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-gray-600" />
                            {fromControlTower && (
                                <>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink
                                            onClick={() => navigate('/control-tower')}
                                            className="flex items-center gap-1 text-gray-500 hover:text-blue-400 cursor-pointer text-[11px] transition-colors"
                                        >
                                            Control Tower
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="text-gray-600" />
                                </>
                            )}
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-blue-400 text-[11px] font-medium">
                                    Inventory Risk
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Inventory Risk Dashboard</h1>
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Execution Mode • AI Verified</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-[150px] h-9 justify-start text-left font-normal bg-[#1a1a1a] border-[#333] text-gray-200 text-xs hover:bg-[#222] hover:text-white ${!selectedDate ? "text-gray-400" : ""}`}
                                >
                                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                    {selectedDate ? format(new Date(selectedDate), "PPP") : <span>All Dates</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-[#1a1a1a] border-[#333] text-white" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate ? new Date(selectedDate + "T12:00:00") : undefined}
                                    onSelect={(date) => {
                                        setSelectedDate(date ? format(date, "yyyy-MM-dd") : "");
                                    }}
                                    initialFocus
                                    className="bg-[#1a1a1a] text-white"
                                />
                            </PopoverContent>
                        </Popover>
                        
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                            <SelectTrigger className="w-[140px] h-9 bg-[#1a1a1a] border-[#333] text-gray-200 text-xs text-left">
                                <SelectValue placeholder="Region" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white max-h-[300px]">
                                {locations.map(loc => (
                                    <SelectItem key={loc.city_id} value={loc.city_id}>{loc.city_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <ToggleGroup type="single" value={riskFilter} onValueChange={(val) => val && setRiskFilter(val)} className="bg-[#1a1a1a] border border-[#333] rounded-md p-0.5 ml-2">
                            <ToggleGroupItem value="all" className="h-8 px-3 text-xs text-gray-400 data-[state=on]:bg-gray-800 data-[state=on]:text-white uppercase font-bold tracking-tighter">Live</ToggleGroupItem>
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
                                            <div className="text-3xl font-bold text-white">{loading ? '...' : kpi.value}</div>
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
                    {/* 3. INVENTORY RISK MATRIX */}
                    <Card className="lg:col-span-2 bg-[#111] border-[#333] flex flex-col">
                        <CardHeader className="pb-2 border-b border-[#222] flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-white text-lg">Risk Matrix</CardTitle>
                                <CardDescription className="text-[10px] text-gray-500 uppercase">Confidence vs Severity Analysis</CardDescription>
                            </div>
                            <div className="flex gap-4 text-[10px]">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-gray-400">Critical</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className="text-gray-400">Shortage</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><span className="text-gray-400">Overstock</span></div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[300px] pt-6 pr-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis 
                                        type="number" 
                                        dataKey="x" 
                                        name="Confidence" 
                                        unit="%" 
                                        domain={[0, 100]} 
                                        stroke="#444" 
                                        fontSize={10}
                                        tick={{fill: '#666'}}
                                    />
                                    <YAxis 
                                        type="number" 
                                        dataKey="y" 
                                        name="Severity" 
                                        domain={[0, 10]} 
                                        stroke="#444" 
                                        fontSize={10}
                                        tick={{fill: '#666'}}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '10px' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ strokeDasharray: '3 3' }} 
                                    />
                                    <Scatter name="Risks" data={risks.map(r => ({
                                        x: r.confidenceNum,
                                        y: r.severity === 'Critical' || r.severity === 'High' ? 8 : (r.severity === 'Medium' ? 5 : 2),
                                        name: r.sku,
                                        risk: r.risk,
                                        color: getRiskColor(r.risk)
                                    }))}>
                                        {risks.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
                                        ))}
                                    </Scatter>
                                    <ReferenceLine x={75} stroke="#333" strokeDasharray="3 3" />
                                    <ReferenceLine y={5} stroke="#333" strokeDasharray="3 3" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 5. DRIVERS & CONTEXT */}
                    <div className="space-y-6 flex flex-col h-full">
                        <Card className="bg-[#111] border-[#333] flex-1 flex flex-col">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white text-base">Primary Drivers</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 min-h-[180px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Trend Spike', value: risks.filter(r => r.driver === 'Trend Spike').length },
                                                { name: 'Weather', value: risks.filter(r => r.driver === 'Weather' || r.driver === 'Weather Heat').length },
                                                { name: 'Event Surge', value: risks.filter(r => r.driver === 'Event Surge').length },
                                                { name: 'Supply Delay', value: risks.filter(r => r.driver === 'Supply Delay').length },
                                                { name: 'Demand Drop', value: risks.filter(r => r.driver === 'Demand Drop').length }
                                            ].filter(d => d.value > 0)}
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#3b82f6" />
                                            <Cell fill="#a855f7" />
                                            <Cell fill="#f97316" />
                                            <Cell fill="#eab308" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '10px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{fontSize: '10px'}} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#151515] border border-blue-900/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-blue-400 flex items-center">
                                    <Zap className="w-4 h-4 mr-2" /> AI Recommendation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-xs text-gray-300 mb-3">Adjusting safety stock to match the 90th percentile demand forecast is recommended for High severity items.</p>
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs">Authorize Rebalancing</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 4. REGIONAL TABLE */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-4 bg-[#111] border-[#333]">
                        <CardHeader className="py-4 border-b border-[#222] flex flex-row items-center justify-between">
                            <CardTitle className="text-white text-lg">Critical Intelligence Alerts</CardTitle>
                            <Button variant="ghost" size="sm" className="text-gray-500 text-[10px] uppercase font-bold tracking-widest h-7">
                                Export .CSV
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[#222] hover:bg-transparent">
                                        <TableHead className="text-gray-400 h-10 w-[20%]">SKU & Store Location</TableHead>
                                        <TableHead className="text-gray-400 h-10">Risk Type</TableHead>
                                        <TableHead className="text-gray-400 h-10">Severity</TableHead>
                                        <TableHead className="text-gray-400 h-10">Cur/Exp Qty</TableHead>
                                        <TableHead className="text-gray-400 h-10 w-[30%]">AI Transfer Insight</TableHead>
                                        <TableHead className="text-gray-400 h-10 text-right">Confidence</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow className="border-[#222]">
                                            <TableCell colSpan={6} className="text-center py-20 text-gray-500 italic font-mono text-xs tracking-tighter animate-pulse">
                                                Analysing demand volatility signatures and replenishment deltas...
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <>
                                            {risks.length === 0 ? (
                                                <TableRow className="border-[#222]">
                                                    <TableCell colSpan={6} className="text-center py-10 text-gray-500 italic">No active risks detected for current filters.</TableCell>
                                                </TableRow>
                                            ) : risks.map((row) => (
                                                <TableRow key={row.id} className="border-[#222] hover:bg-[#151515]/50 transition-colors">
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-white text-sm tracking-tight">{row.sku}</span>
                                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{row.store} • {row.city}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`border-${getRiskColor(row.risk).replace('#', '')}/30 text-white text-[10px] h-5 bg-${getRiskColor(row.risk).replace('#', '')}/5`}>
                                                            {row.risk}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${row.severity === 'Critical' || row.severity === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                                            <span className={`${row.severity === 'Critical' || row.severity === 'High' ? 'text-red-500 font-bold' : 'text-yellow-500'} text-xs`}>{row.severity}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col text-xs font-mono">
                                                            <span className="text-gray-300">Cur: {row.currentQty}</span>
                                                            <span className="text-gray-500">Exp: {row.expectedQty}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="bg-[#1a1a1a] border border-[#333] px-2 py-1.5 rounded text-xs text-blue-300 leading-tight">
                                                            <Zap className="w-3 h-3 inline-block mr-1 text-yellow-400" />
                                                            {row.insight}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-blue-400 font-mono text-xs font-bold leading-none">{row.confidence}</span>
                                                            <div className="w-16 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                                                                <div className="h-full bg-blue-500" style={{ width: row.confidence }}></div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InventoryRiskPage;

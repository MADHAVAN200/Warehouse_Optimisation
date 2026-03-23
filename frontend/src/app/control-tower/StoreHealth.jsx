import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Activity, TrendingUp, AlertTriangle, CheckCircle2,
    ArrowRight, MapPin, Store, Calendar, Clock,
    Package, Users, ShoppingCart, Zap, BarChart2,
    ShieldAlert, Search, Home, RefreshCw, Check, ChevronsUpDown,
    Info, FileText, History, DollarSign
} from 'lucide-react';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis
} from 'recharts';
import {
    Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbPage, BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { masterDataService } from '@/services/masterDataService';
import { storeHealthService } from '@/services/storeHealthService';

// Helper to map icon strings to components
const IconMap = {
    BarChart2,
    Package,
    Activity,
    ShoppingCart,
    Zap
};

// --- COMPONENT ---

const StoreHealthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fromControlTower = queryParams.get('from') === 'control-tower';

    // Filter States
    const [cities, setCities] = useState([]);
    const [selectedCityIds, setSelectedCityIds] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState("all");
    const [timeContext, setTimeContext] = useState("live");
    const [openCityPopover, setOpenCityPopover] = useState(false);

    // Data States
    const [healthData, setHealthData] = useState(null);
    const [storeSummary, setStoreSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(false);

    // 1. Initial Load: Fetch Cities
    useEffect(() => {
        const fetchBaseData = async () => {
            try {
                const cData = await masterDataService.getCities();
                setCities(cData);
                // Default to first city if none selected
                if (cData.length > 0 && selectedCityIds.length === 0) {
                    setSelectedCityIds([cData[0].city_id]);
                }
            } catch (err) {
                console.error("Failed to fetch cities:", err);
            }
        };
        fetchBaseData();
    }, []);

    // 2. Fetch Stores when Cities change
    useEffect(() => {
        const fetchStores = async () => {
            if (selectedCityIds.length === 0) {
                setStores([]);
                setSelectedStore("all");
                return;
            }
            try {
                const sData = await masterDataService.getStores({ cityIds: selectedCityIds });
                setStores(sData);
                if (sData.length > 0) {
                    // Keep selected store if it belongs to the new city set, otherwise reset
                    const currentStoreInSet = sData.find(s => s.store_id === selectedStore);
                    if (!currentStoreInSet) setSelectedStore(sData[0].store_id);
                } else {
                    setSelectedStore("all");
                }
            } catch (err) {
                console.error("Failed to fetch stores:", err);
            }
        };
        fetchStores();
    }, [selectedCityIds]);

    // 3. Fetch Health Data & Summary when Store changes
    useEffect(() => {
        const fetchHealth = async () => {
            if (selectedStore === 'all' || !selectedStore) {
                setHealthData(null);
                setStoreSummary(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            setSummaryLoading(true);
            try {
                const [hData, sSummary] = await Promise.all([
                    storeHealthService.getStoreHealth(selectedStore),
                    storeHealthService.getStoreSummary(selectedStore)
                ]);
                setHealthData(hData);
                setStoreSummary(sSummary);
            } catch (err) {
                console.error("Failed to fetch health metrics:", err);
            } finally {
                setLoading(false);
                setSummaryLoading(false);
            }
        };
        fetchHealth();
    }, [selectedStore]);

    const handleCitySelect = (cityId) => {
        setSelectedCityIds(current => 
            current.includes(cityId) 
                ? current.filter(id => id !== cityId)
                : [...current, cityId]
        );
    };

    const healthScoreData = healthData ? [{ name: 'Health', value: healthData.overallScore, fill: '#3b82f6' }] : [];
    const selectedStoreName = stores.find(s => s.store_id === selectedStore)?.store_name || 'Select Store';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground pb-20 font-sans">

            {/* 1. GLOBAL STORE FILTERS (Sticky) */}
            <div className="sticky top-0 z-30 bg-[#111] border-b border-[#222] shadow-lg">
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
                                    Store Health
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Store className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Store Health Overview</h1>
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></span>
                                {loading ? 'Fetching Operations...' : 'Live Operational Status'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Multi-City Popover */}
                        <Popover open={openCityPopover} onOpenChange={setOpenCityPopover}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCityPopover}
                                    className="w-[220px] justify-between h-9 bg-[#1a1a1a] border-[#333] text-gray-200 text-xs shadow-inner hover:bg-[#222] hover:text-white transition-all"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                                        <span className="truncate">
                                            {selectedCityIds.length === 0 
                                                ? "Select Cities" 
                                                : selectedCityIds.length === 1 
                                                    ? cities.find(c => c.city_id === selectedCityIds[0])?.city_name 
                                                    : `${selectedCityIds.length} Cities Selected`}
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[220px] p-0 bg-[#1a1a1a] border-[#333]">
                                <Command className="bg-[#1a1a1a]">
                                    <CommandInput placeholder="Search cities..." className="h-8 text-xs text-white" />
                                    <CommandList>
                                        <CommandEmpty className="text-xs text-gray-500 py-2 px-4">No city found.</CommandEmpty>
                                        <CommandGroup>
                                            {cities.map((city) => (
                                                <CommandItem
                                                    key={city.city_id}
                                                    value={city.city_name}
                                                    onSelect={() => handleCitySelect(city.city_id)}
                                                    className="text-xs text-gray-200 hover:bg-[#222] cursor-pointer"
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-3 w-3",
                                                            selectedCityIds.includes(city.city_id) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {city.city_name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {/* Store Selector (Dependent on Cities) */}
                        <Select value={selectedStore} onValueChange={setSelectedStore}>
                            <SelectTrigger className="w-[220px] h-9 bg-[#1a1a1a] border-[#333] text-gray-200 text-xs shadow-inner">
                                <div className="flex items-center gap-2">
                                    <Store className="w-3 h-3 text-blue-400 shrink-0" />
                                    <SelectValue placeholder="Select Store" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                {stores.map(s => (
                                    <SelectItem key={s.store_id} value={s.store_id} className="text-xs">
                                        {s.store_name} ({s.cities?.city_name})
                                    </SelectItem>
                                ))}
                                {stores.length === 0 && <SelectItem value="all" disabled className="text-xs">No Stores in Selected Cities</SelectItem>}
                            </SelectContent>
                        </Select>

                        <ToggleGroup type="single" value={timeContext} onValueChange={(val) => val && setTimeContext(val)} className="bg-[#1a1a1a] border border-[#333] rounded-md p-0.5">
                            <ToggleGroupItem value="live" className="h-8 px-3 text-xs text-gray-400 data-[state=on]:bg-blue-900/40 data-[state=on]:text-blue-400">Live</ToggleGroupItem>
                            <ToggleGroupItem value="72h" className="h-8 px-3 text-xs text-gray-400 data-[state=on]:bg-gray-800 data-[state=on]:text-white">Next 72h</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
            </div>

            <div className="p-6 w-full space-y-6">
                {loading && !healthData ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-gray-500 text-sm animate-pulse font-mono tracking-widest">SYNTHESIZING OPERATIONAL SIGNALS...</p>
                    </div>
                ) : (
                    <>
                        {/* 2. STORE INSIGHTS & PERFORMANCE SUMMARY */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Insight Narrative */}
                            <Card className="lg:col-span-2 bg-[#111] border-[#333] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FileText className="w-24 h-24 text-blue-500" />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldAlert className="w-4 h-4 text-blue-500" />
                                        Operational Intelligence Summary
                                    </CardTitle>
                                    <CardDescription className="text-xs text-gray-500 font-mono">
                                        Generated via real-time risk correlation at {storeSummary?.lastSync || '00:00'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-lg font-medium text-white leading-relaxed border-l-2 border-blue-500 pl-4 bg-blue-500/5 py-3 rounded-r-lg">
                                        {storeSummary?.narrative || 'Analyzing store operations...'}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                        {storeSummary?.highlights.map((highlight, idx) => (
                                            <div key={idx} className="bg-[#151515] p-3 rounded border border-[#222] group hover:border-blue-500/30 transition-all cursor-default">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Highlight {idx + 1}</span>
                                                </div>
                                                <p className="text-xs text-gray-300 leading-normal">{highlight}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <div className="p-4 bg-[#151515] border-t border-[#222] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <History className="w-3.5 h-3.5 text-gray-500" />
                                            <span className="text-[10px] text-gray-400 uppercase font-mono">Last Shift: Stable</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-3.5 h-3.5 text-green-500" />
                                            <span className="text-[10px] text-gray-400 uppercase font-mono">Current Stock Value: {storeSummary?.inventoryValue || '--'}</span>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-blue-400 border-blue-900/50 bg-blue-900/10 h-6 px-2 text-[10px] uppercase font-bold">
                                        AI Optimized
                                    </Badge>
                                </div>
                            </Card>

                            {/* Radial Score Card */}
                            <Card className="bg-[#111] border-[#333] flex flex-col items-center justify-center p-6 relative overflow-hidden h-full">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                                <h2 className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Node Health Index</h2>
                                <div className="relative w-48 h-48 flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart
                                            innerRadius="70%"
                                            outerRadius="100%"
                                            barSize={12}
                                            data={healthScoreData}
                                            startAngle={180}
                                            endAngle={0}
                                        >
                                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                            <RadialBar background clockWise dataKey="value" cornerRadius={12} fill="#3b82f6" />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-6xl font-black text-white">{healthData?.overallScore || '--'}</span>
                                        <Badge className={`mt-2 font-black tracking-tighter shadow-xl px-4 py-1 ${
                                            healthData?.status === 'Healthy' ? 'bg-green-500 text-black hover:bg-green-400' :
                                            healthData?.status === 'Acceptable' ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-red-500 text-white hover:bg-red-400'
                                        }`}>{healthData?.status || 'Active'}</Badge>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 text-center mt-4 px-6 italic font-mono leading-relaxed opacity-70">
                                    Derived from {selectedStoreName} real-time risk index using multi-variate operational signals.
                                </p>
                            </Card>
                        </div>

                        {/* 3. CORE DIMENSIONS & RISK SNAPSHOT */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                             {/* Core Dimensions */}
                             <div className="lg:col-span-2 space-y-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest border-b border-blue-500 py-1">Operational Dimensions</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {healthData?.dimensions.map((dim, idx) => {
                                        const Icon = IconMap[dim.icon] || Activity;
                                        return (
                                            <div key={idx} className={`bg-[#151515] p-4 rounded-xl border border-[#222] flex items-center justify-between hover:border-[#444] hover:bg-[#1a1a1a] transition-all cursor-pointer group`}>
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-lg bg-[#111] ${dim.color} group-hover:bg-blue-500 group-hover:text-black transition-all border border-[#333]`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white tracking-tight">{dim.title}</div>
                                                        <div className="text-[11px] text-gray-500 font-mono italic">{dim.status}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <div className="text-lg font-black text-white">{dim.score}</div>
                                                        <div className={`text-[10px] font-bold px-1.5 rounded ${dim.trend.startsWith('+') ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>{dim.trend}</div>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Risk Snapshot Grid */}
                            <div className="lg:col-span-2 space-y-3">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest border-b border-orange-500 py-1">Critical Risk Snapshot</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {healthData?.riskSnapshots.map((risk, idx) => (
                                        <div key={idx} className="bg-[#111] p-5 rounded-2xl border border-[#333] flex flex-col justify-between hover:bg-[#151515] hover:scale-[1.02] transition-all cursor-default">
                                            <div className="flex justify-between items-start mb-3">
                                                <Badge variant="outline" className={`
                                                    ${risk.severity === 'Critical' ? 'text-red-400 border-red-900 bg-red-900/10' :
                                                        risk.severity === 'High' ? 'text-orange-400 border-orange-900 bg-orange-900/10' :
                                                            'text-gray-400 border-gray-800'} text-[10px] h-6 px-2 uppercase font-black tracking-tighter
                                                `}>
                                                    {risk.severity}
                                                </Badge>
                                                <div className="text-3xl font-black text-white tabular-nums">{risk.count}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-200 uppercase tracking-wide">{risk.title}</div>
                                                <div className="text-[11px] text-gray-500 mt-2 leading-relaxed italic border-t border-[#222] pt-2">{risk.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>

                        {/* 4. IMMEDIATE ATTENTION QUEUE */}
                        <div className="bg-[#111] border border-[#333] rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-5 border-b border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#151515] to-[#111]">
                                <div>
                                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                                        Immediate Attention Queue
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium italic mt-1">
                                        Top criticality interventions prioritized for <span className="text-blue-400 font-bold underline underline-offset-4 decoration-blue-500/30">{selectedStoreName}</span>.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs h-9">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Export Log
                                    </Button>
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold h-9 px-6 shadow-lg shadow-blue-500/20">
                                        Expedite All
                                    </Button>
                                </div>
                            </div>
                            {healthData?.attentionQueue.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-[#222] bg-[#151515]/50 hover:bg-[#151515]/50">
                                            <TableHead className="text-gray-500 h-10 text-[10px] uppercase font-black w-[250px] pl-6 tracking-[0.1em]">Issue Identification</TableHead>
                                            <TableHead className="text-gray-500 h-10 text-[10px] uppercase font-black tracking-[0.1em]">Intelligence Context</TableHead>
                                            <TableHead className="text-gray-500 h-10 text-[10px] uppercase font-black w-[130px] tracking-[0.1em]">Risk Level</TableHead>
                                            <TableHead className="text-gray-500 h-10 text-[10px] uppercase font-black w-[130px] tracking-[0.1em]">Response Window</TableHead>
                                            <TableHead className="text-gray-500 h-10 text-[10px] uppercase font-black text-right pr-6 tracking-[0.1em]">Resolution</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {healthData.attentionQueue.map((row) => (
                                            <TableRow key={row.id} className="border-[#222] hover:bg-[#1a1a1a] group transition-colors">
                                                <TableCell className="font-bold text-white py-4 pl-6 flex items-center gap-3">
                                                    <div className={`w-1 h-8 rounded-full ${
                                                        row.severity === 'Critical' ? 'bg-red-500' :
                                                        row.severity === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                                                    }`}></div>
                                                    {row.issue}
                                                </TableCell>
                                                <TableCell className="text-gray-400 text-sm py-4 max-w-[400px]">
                                                   <p className="line-clamp-2 leading-relaxed italic">{row.desc}</p>
                                                </TableCell>
                                                <TableCell className="py-4 font-mono">
                                                    <Badge variant="outline" className={`
                                                        px-2 py-0.5 text-[10px] font-black uppercase rounded-sm
                                                        ${row.severity === 'Critical' ? 'text-red-400 border-red-900 bg-red-900/10' :
                                                            row.severity === 'High' ? 'text-orange-400 border-orange-900 bg-orange-900/10' :
                                                                'text-blue-400 border-blue-900 bg-blue-900/10'}
                                                    `}>
                                                        {row.severity}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-300 text-[11px] font-mono py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3 text-gray-500" />
                                                        {row.time}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right py-4 pr-6">
                                                    <Button size="sm" variant="ghost" className="h-8 text-xs font-bold text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 px-3">
                                                        {row.action}
                                                        <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-20 text-center bg-[#0d0d0d]">
                                    <div className="relative inline-block">
                                        <CheckCircle2 className="w-16 h-16 text-green-500/20 mx-auto mb-6" />
                                        <div className="absolute inset-0 animate-ping rounded-full bg-green-500/5"></div>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2">Systems Nominal</h4>
                                    <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">No immediate operational risks detected for the selected node. AI monitoring continues at ultra-high frequency.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StoreHealthPage;

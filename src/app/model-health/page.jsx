
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area, ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import {
    Activity, ShieldCheck, AlertTriangle, AlertOctagon,
    CheckCircle2, TrendingUp, TrendingDown, RefreshCcw,
    Zap, Brain, Microscope, ArrowRight, Filter, Download
} from 'lucide-react';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Progress } from "@/components/ui/progress";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

// --- MOCK DATA ---

const ACCURACY_TREND_DATA = [
    { date: "Jan 10", forecast: 94.2, vision: 96.5 },
    { date: "Jan 11", forecast: 94.5, vision: 96.2 },
    { date: "Jan 12", forecast: 93.8, vision: 96.0 },
    { date: "Jan 13", forecast: 94.0, vision: 95.8 },
    { date: "Jan 14", forecast: 93.5, vision: 95.2 },
    { date: "Jan 15", forecast: 92.8, vision: 94.8 },
    { date: "Jan 16", forecast: 92.1, vision: 93.5 }, // Drift starting
];

const DRIFT_HEATMAP_DATA = [
    { store: "Store 402", feature: "Temperature", severity: 0.1 },
    { store: "Store 402", feature: "Footfall", severity: 0.8 }, // High drift
    { store: "Store 402", feature: "Inventory", severity: 0.2 },
    { store: "Store 115", feature: "Temperature", severity: 0.3 },
    { store: "Store 115", feature: "Footfall", severity: 0.2 },
    { store: "Store 115", feature: "Inventory", severity: 0.1 },
    { store: "Store 892", feature: "Temperature", severity: 0.7 }, // High drift
    { store: "Store 892", feature: "Footfall", severity: 0.4 },
    { store: "Store 892", feature: "Inventory", severity: 0.3 },
];

const FEATURE_IMPORTANCE_DATA = [
    { feature: "Historical Sales", baseline: 0.45, current: 0.42, delta: -0.03, status: "Stable" },
    { feature: "Local Weather", baseline: 0.15, current: 0.25, delta: +0.10, status: "Shift Detected" },
    { feature: "Promotion Status", baseline: 0.20, current: 0.18, delta: -0.02, status: "Stable" },
    { feature: "Competitor Price", baseline: 0.10, current: 0.05, delta: -0.05, status: "Decaying" },
];

const ALERTS = [
    { id: 1, type: "Critical", message: "Vision Model accuracy dropped below 94% threshold.", time: "2h ago" },
    { id: 2, type: "Warning", message: "Significant data drift detected in 'Footfall' feature for Store 402.", time: "5h ago" },
    { id: 3, type: "Info", message: "Scheduled retraining skipped due to insufficient new data.", time: "1d ago" },
];

// --- COMPONENT ---

const ModelHealthPage = () => {
    const navigate = useNavigate();
    const [modelType, setModelType] = useState("all");

    // Helper for heatmap color
    const getHeatmapColor = (severity) => {
        if (severity >= 0.7) return "#ef4444"; // Red
        if (severity >= 0.4) return "#eab308"; // Yellow
        return "#22c55e"; // Green
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground pb-20 font-sans w-full flex flex-col">

            {/* 1. HEADER & SUMMARY */}
            <header className="sticky top-0 z-30 bg-[#111] border-b border-[#222] shadow-lg">
                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-900/20 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                Model Health & Drift
                            </h1>
                            <div className="text-xs text-gray-500 font-mono flex items-center gap-3 mt-1">
                                <span className="flex items-center"><Brain className="w-3 h-3 mr-1" /> AI Reliability Layer</span>
                                <span>•</span>
                                <span className="flex items-center"><Activity className="w-3 h-3 mr-1" /> Monitoring Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select defaultValue="all" onValueChange={setModelType}>
                            <SelectTrigger className="w-[180px] h-9 bg-[#1a1a1a] border-[#333] text-sm">
                                <SelectValue placeholder="Model Scope" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Models</SelectItem>
                                <SelectItem value="forecast">Demand Forecast</SelectItem>
                                <SelectItem value="vision">Checkout Vision</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="sm" className="h-9 border-[#333] text-gray-400 hover:text-white bg-[#1a1a1a]">
                            <Download className="w-4 h-4 mr-2" /> Report
                        </Button>
                    </div>
                </div>
            </header>

            <div className="p-6 w-full max-w-[1800px] mx-auto space-y-6">

                {/* 2. HEALTH SCORECARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-[#111] border-[#333] md:col-span-1">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-medium text-gray-500 uppercase">Overall Reliability Score</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl font-bold text-yellow-500">88/100</div>
                                <p className="text-xs text-yellow-600 mt-1 font-medium">Needs Attention</p>
                            </div>
                            <div className="h-16 w-16 rounded-full border-4 border-yellow-500/20 border-t-yellow-500 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-medium text-gray-500 uppercase">Drift Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500 flex items-center gap-2">
                                <AlertOctagon className="w-5 h-5" /> Critical
                            </div>
                            <p className="text-xs text-gray-400 mt-1">2 features showing high drift</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-medium text-gray-500 uppercase">Accuracy Stability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                                <TrendingDown className="w-5 h-5" /> Degrading
                            </div>
                            <p className="text-xs text-gray-400 mt-1">-1.5% drop in last 24h</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-medium text-gray-500 uppercase">Last Verified</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white font-mono">v4.2.1</div>
                            <p className="text-xs text-gray-400 mt-1">Checked 15m ago</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* 3. PERFORMANCE TRENDS (2/3 Width) */}
                    <Card className="lg:col-span-2 bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white">Model Performance Stability</CardTitle>
                            <CardDescription className="text-gray-500">Tracking accuracy metrics over the last 7 days to detect regression.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ACCURACY_TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis dataKey="date" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                                    <YAxis domain={[90, 100]} stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="forecast" name="Forecast Model" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                                    <Line type="monotone" dataKey="vision" name="Vision Model" stroke="#a855f7" strokeWidth={2} dot={{ r: 4, fill: '#a855f7' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 4. ALERTS & ACTIONS (1/3 Width) */}
                    <Card className="bg-[#111] border-[#333] flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" /> Recent Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            {ALERTS.map((alert) => (
                                <div key={alert.id} className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] hover:border-gray-700 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge variant="outline" className={`
                                            ${alert.type === 'Critical' ? 'text-red-400 border-red-900 bg-red-900/10' :
                                                alert.type === 'Warning' ? 'text-yellow-400 border-yellow-900 bg-yellow-900/10' :
                                                    'text-blue-400 border-blue-900 bg-blue-900/10'}
                                        `}>
                                            {alert.type}
                                        </Badge>
                                        <span className="text-xs text-gray-500">{alert.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-snug">{alert.message}</p>
                                </div>
                            ))}
                            <Separator className="bg-[#222] my-4" />
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Recommended Actions</h4>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
                                    <RefreshCcw className="w-4 h-4 mr-2" /> Trigger Retraining
                                </Button>
                                <Button variant="outline" className="w-full border-[#333] text-gray-300 hover:text-white justify-start bg-[#1a1a1a]">
                                    <Microscope className="w-4 h-4 mr-2" /> Analyze Root Cause
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 5. DRIFT HEATMAP & FEATURE IMPORTANCE */}
                    <Card className="lg:col-span-2 bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white">Data Drift Heatmap</CardTitle>
                            <CardDescription className="text-gray-500">Visualizing input feature stability across stores (Store x Feature).</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center">
                            {/* Simplified Visual Representation using Grid for Heatmap feel */}
                            <div className="w-full h-full p-4 overflow-auto">
                                <div className="grid grid-cols-4 gap-2 text-sm">
                                    <div className="font-bold text-gray-500">Store / Feature</div>
                                    <div className="font-mono text-gray-400 text-center">Temperature</div>
                                    <div className="font-mono text-gray-400 text-center">Footfall</div>
                                    <div className="font-mono text-gray-400 text-center">Inventory</div>

                                    {/* Rows */}
                                    {['Store 402', 'Store 115', 'Store 892'].map(store => (
                                        <React.Fragment key={store}>
                                            <div className="font-mono text-gray-300 py-4 border-b border-[#222]">{store}</div>
                                            {DRIFT_HEATMAP_DATA
                                                .filter(d => d.store === store)
                                                .map((d, i) => (
                                                    <div key={i} className="flex items-center justify-center border-b border-[#222]">
                                                        <div
                                                            className="w-16 h-8 rounded flex items-center justify-center text-xs font-bold text-black"
                                                            style={{ backgroundColor: getHeatmapColor(d.severity) }}
                                                        >
                                                            {(d.severity * 100).toFixed(0)}%
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white">Feature Shift</CardTitle>
                            <CardDescription className="text-gray-500">Importance changes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-[#1a1a1a]">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="text-gray-400">Feature</TableHead>
                                        <TableHead className="text-gray-400 text-right">Delta</TableHead>
                                        <TableHead className="text-gray-400 text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {FEATURE_IMPORTANCE_DATA.map((feat, i) => (
                                        <TableRow key={i} className="border-b border-[#222] hover:bg-[#1a1a1a] transition-colors">
                                            <TableCell className="font-medium text-gray-300 text-xs">{feat.feature}</TableCell>
                                            <TableCell className={`text-right font-mono text-xs ${feat.delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {feat.delta > 0 ? '+' : ''}{(feat.delta * 100).toFixed(0)}%
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className="text-xs scale-90 origin-right border-gray-700 text-gray-400">
                                                    {feat.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default ModelHealthPage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GitBranch, RefreshCw, Save, Play, AlertTriangle,
    TrendingUp, ArrowRight, Package, Layers, Activity,
    Sliders, Thermometer, Calendar
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
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Mock Data
const SCENARIO_DATA = [
    { date: 'Jan 15', baseline: 120, scenario: 120 },
    { date: 'Jan 16', baseline: 125, scenario: 128 },
    { date: 'Jan 17', baseline: 130, scenario: 145 },
    { date: 'Jan 18', baseline: 115, scenario: 135 },
    { date: 'Jan 19', baseline: 140, scenario: 165 },
    { date: 'Jan 20', baseline: 150, scenario: 180 },
    { date: 'Jan 21', baseline: 145, scenario: 170 },
    { date: 'Jan 22', baseline: 135, scenario: 155 },
    { date: 'Jan 23', baseline: 130, scenario: 145 },
    { date: 'Jan 24', baseline: 125, scenario: 135 },
    { date: 'Jan 25', baseline: 140, scenario: 150 },
    { date: 'Jan 26', baseline: 145, scenario: 160 },
    { date: 'Jan 27', baseline: 138, scenario: 145 },
    { date: 'Jan 28', baseline: 132, scenario: 140 },
];

const RISK_IMPACT = [
    { sku: "SKU-101 (Cola)", baseRisk: "Low", scenRisk: "High", change: "Critical" },
    { sku: "SKU-205 (Chips)", baseRisk: "Low", scenRisk: "Medium", change: "Moderate" },
    { sku: "SKU-310 (Water)", baseRisk: "Medium", scenRisk: "Medium", change: "Stable" },
    { sku: "SKU-404 (Beer)", baseRisk: "Medium", scenRisk: "High", change: "Critical" },
    { sku: "SKU-520 (Ice)", baseRisk: "Low", scenRisk: "High", change: "Critical" },
    { sku: "SKU-112 (Bread)", baseRisk: "Low", scenRisk: "Low", change: "Stable" },
    { sku: "SKU-770 (Burgers)", baseRisk: "Low", scenRisk: "Medium", change: "Moderate" },
];

const ScenarioPlanningPage = () => {
    const navigate = useNavigate();

    // Controls State
    const [eventImpact, setEventImpact] = useState([0]);
    const [weatherSeverity, setWeatherSeverity] = useState("normal");
    const [trendOverride, setTrendOverride] = useState("asis");

    // Derived Metric (Mock)
    const demandChange = Math.round(15 + (eventImpact[0] / 2));

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground pb-20">
            {/* Header */}
            <div className="bg-[#111] border-b border-[#222] px-6 py-6">
                <div className="flex items-center space-x-3 mb-2">
                    <GitBranch className="w-8 h-8 text-purple-500" />
                    <h1 className="text-3xl font-bold text-white">Scenario Planning</h1>
                </div>
                <p className="text-gray-300 max-w-2xl">
                    Simulate demand outcomes under changing conditions. Test "What-If" assumptions.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-140px)]">
                {/* Left Control Panel */}
                <aside className="w-full lg:w-80 bg-[#0f0f0f] border-r border-[#222] p-6 lg:overflow-y-auto space-y-8">

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Configuration</h3>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                            <Sliders className="w-4 h-4 mr-2" />
                            Scope & Controls
                        </h3>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-400 mb-1 block">Region Focus</label>
                            <Select defaultValue="ny">
                                <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white">
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                    <SelectItem value="ny">New York</SelectItem>
                                    <SelectItem value="austin">Austin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-400 mb-1 block">Benchmark</label>
                            <Select defaultValue="current">
                                <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white">
                                    <SelectValue placeholder="Baseline Forecast" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                    <SelectItem value="current">Current Forecast</SelectItem>
                                    <SelectItem value="last_year">Last Year Actuals</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator className="bg-[#222]" />

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-300 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-blue-500" /> Event Impact
                                </label>
                                <span className={`text-xs font-bold ${eventImpact[0] > 0 ? 'text-green-500' : eventImpact[0] < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {eventImpact[0] > 0 ? '+' : ''}{eventImpact[0]}%
                                </span>
                            </div>
                            <Slider
                                value={eventImpact}
                                onValueChange={setEventImpact}
                                min={-50}
                                max={50}
                                step={5}
                                className="py-2"
                            />
                            <p className="text-xs text-gray-400">Adjust expected impact of local events.</p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300 flex items-center">
                                <Thermometer className="w-4 h-4 mr-2 text-yellow-500" /> Weather Severity
                            </label>
                            <ToggleGroup type="single" value={weatherSeverity} onValueChange={(val) => val && setWeatherSeverity(val)} className="justify-start items-center bg-[#1a1a1a] p-1 rounded-md border border-[#333]">
                                <ToggleGroupItem value="mild" className="h-8 text-xs text-gray-400 data-[state=on]:bg-green-900/40 data-[state=on]:text-green-400">Mild</ToggleGroupItem>
                                <ToggleGroupItem value="normal" className="h-8 text-xs text-gray-400 data-[state=on]:bg-gray-700 data-[state=on]:text-white">Normal</ToggleGroupItem>
                                <ToggleGroupItem value="severe" className="h-8 text-xs text-gray-400 data-[state=on]:bg-red-900/40 data-[state=on]:text-red-400">Severe</ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-2 text-purple-500" /> Trend Momentum
                            </label>
                            <Select value={trendOverride} onValueChange={setTrendOverride}>
                                <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                    <SelectItem value="slow">Slowdown</SelectItem>
                                    <SelectItem value="asis">As-Is</SelectItem>
                                    <SelectItem value="accel">Acceleration</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button className="w-full" variant="outline" onClick={() => {
                            setEventImpact([0]);
                            setWeatherSeverity("normal");
                            setTrendOverride("asis");
                        }}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Reset to Baseline
                        </Button>
                    </div>

                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 space-y-6 bg-[#0a0a0a] overflow-y-auto">

                    {/* Comparison Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-[#111] border-[#333]">
                            <CardContent className="pt-6">
                                <div className="text-sm text-gray-400 mb-1">Total Demand Delta</div>
                                <div className="text-2xl font-bold text-white flex items-center">
                                    {demandChange > 0 ? '+' : ''}{demandChange}%
                                    {demandChange > 0 ? <TrendingUp className="w-5 h-5 ml-2 text-green-500" /> : <TrendingUp className="w-5 h-5 ml-2 text-red-500 rotate-180" />}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#111] border-[#333]">
                            <CardContent className="pt-6">
                                <div className="text-sm text-gray-400 mb-1">Peak Day Shift</div>
                                <div className="text-2xl font-bold text-white flex items-center">
                                    +1 Day
                                    <Calendar className="w-5 h-5 ml-2 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#111] border-[#333]">
                            <CardContent className="pt-6">
                                <div className="text-sm text-gray-400 mb-1">Confidence Deviation</div>
                                <div className="text-2xl font-bold text-yellow-500 flex items-center">
                                    -12%
                                    <Activity className="w-5 h-5 ml-2" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#111] border-[#333]">
                            <CardContent className="pt-6">
                                <div className="text-sm text-gray-400 mb-1">Inventory Risk</div>
                                <div className="text-2xl font-bold text-red-500 flex items-center">
                                    Elevated
                                    <AlertTriangle className="w-5 h-5 ml-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Visualizations */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 bg-[#111] border-[#333]">
                            <CardHeader>
                                <CardTitle className="text-white">Demand Comparison: Baseline vs Scenario</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Projected impact of selected assumptions over the next 7 days.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={SCENARIO_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                        <XAxis dataKey="date" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="baseline" stroke="#555" strokeWidth={2} strokeDasharray="5 5" name="Baseline Forecast" />
                                        <Line type="monotone" dataKey="scenario" stroke="#8b5cf6" strokeWidth={3} name="Simulated Outcome" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Operational Impact */}
                        <div className="space-y-6">
                            <Card className="bg-[#111] border-[#333]">
                                <CardHeader>
                                    <CardTitle className="text-white text-base">Operational Impact Assessment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-[#222] hover:bg-transparent">
                                                <TableHead className="text-gray-300">SKU Name</TableHead>
                                                <TableHead className="text-gray-300">Risk Type</TableHead>
                                                <TableHead className="text-gray-300 text-right">Impact</TableHead>
                                                <TableHead className="text-gray-300 text-right">Est. Cost</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {RISK_IMPACT.map((item, i) => (
                                                <TableRow key={i} className="border-[#222] hover:bg-[#1a1a1a]">
                                                    <TableCell className="text-sm text-gray-300 py-2">{item.sku}</TableCell>
                                                    <TableCell className="py-2">
                                                        <Badge variant="outline" className={`${item.change === 'Critical' ? 'text-red-400 border-red-900 bg-red-900/10' :
                                                            item.change === 'Moderate' ? 'text-yellow-400 border-yellow-900 bg-yellow-900/10' :
                                                                'text-gray-400 border-gray-800'
                                                            }`}>
                                                            {item.change}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#1a1a1a] border border-blue-900/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-blue-400 flex items-center">
                                        <Activity className="w-4 h-4 mr-2" />
                                        AI Recommendation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        Under these conditions, peak demand shifts to <span className="text-white font-bold">Jan 20</span>. Recommended action:
                                        Advance replenishment for Category B by 24 hours to avoid stockouts.
                                    </p>
                                    <Button size="sm" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/dashboard/godown')}>
                                        View Replenishment Plan
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ScenarioPlanningPage;

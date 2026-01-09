
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart as LineGrid, TrendingUp, TrendingDown, Activity,
    AlertCircle, BarChart2, Calendar, Layers, ArrowRight,
    Package, ShoppingCart, Zap, Menu
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
    ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar
} from 'recharts';

// Mock Data
const FORECAST_DATA = [
    { date: 'Jan 10', history: 120, forecast: null, lower: null, upper: null, event: false },
    { date: 'Jan 11', history: 135, forecast: null, lower: null, upper: null, event: false },
    { date: 'Jan 12', history: 125, forecast: null, lower: null, upper: null, event: false },
    { date: 'Jan 13', history: 130, forecast: 130, lower: 125, upper: 135, event: false }, // Transition Point
    { date: 'Jan 14', history: null, forecast: 145, lower: 130, upper: 160, event: true },
    { date: 'Jan 15', history: null, forecast: 155, lower: 135, upper: 175, event: true },
    { date: 'Jan 16', history: null, forecast: 150, lower: 140, upper: 160, event: false },
    { date: 'Jan 17', history: null, forecast: 142, lower: 138, upper: 146, event: false },
    { date: 'Jan 18', history: null, forecast: 138, lower: 130, upper: 145, event: false },
    { date: 'Jan 19', history: null, forecast: 140, lower: 132, upper: 148, event: false },
];

const DRIVER_CONTRIBUTION = [
    { factor: 'Historical Pattern', value: 45, fill: '#6b7280' },
    { factor: 'Recent Trend', value: 20, fill: '#3b82f6' },
    { factor: 'Event Uplift', value: 25, fill: '#a855f7' },
    { factor: 'Weather', value: 10, fill: '#22c55e' },
];

const ForecastEnginePage = () => {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState("New York");
    const [selectedCategory, setSelectedCategory] = useState("Beverages");
    const [horizon, setHorizon] = useState("7");
    const [scenario, setScenario] = useState("combined");

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground pb-20">
            {/* Header */}
            <div className="bg-[#111] border-b border-[#222] px-6 py-6">
                <div className="flex items-center space-x-3 mb-2">
                    <LineGrid className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-white">Demand Forecast Engine</h1>
                </div>
                <p className="text-gray-400 max-w-2xl">
                    AI-driven demand prediction integrating history, trends, events, and weather signals.
                </p>
            </div>

            {/* Global Filters */}
            <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#222] px-6 py-4 shadow-md">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase">Store / City</label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="New York">New York</SelectItem>
                                <SelectItem value="Austin">Austin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="Beverages">Beverages</SelectItem>
                                <SelectItem value="Snacks">Snacks</SelectItem>
                                <SelectItem value="Household">Household</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase">Horizon</label>
                        <Select value={horizon} onValueChange={setHorizon}>
                            <SelectTrigger className="w-[140px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="Next 7 Days" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="3">Next 3 Days</SelectItem>
                                <SelectItem value="7">Next 7 Days</SelectItem>
                                <SelectItem value="14">Next 14 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase">Scenario Focus</label>
                        <ToggleGroup type="single" value={scenario} onValueChange={(val) => val && setScenario(val)} className="bg-[#1a1a1a] border border-[#333] rounded-md p-1">
                            <ToggleGroupItem value="base" className="data-[state=on]:bg-gray-700 data-[state=on]:text-white text-gray-400 hover:text-white h-8 text-xs">Base</ToggleGroupItem>
                            <ToggleGroupItem value="event" className="data-[state=on]:bg-purple-900/50 data-[state=on]:text-purple-300 text-gray-400 hover:text-white h-8 text-xs">Event</ToggleGroupItem>
                            <ToggleGroupItem value="weather" className="data-[state=on]:bg-blue-900/50 data-[state=on]:text-blue-300 text-gray-400 hover:text-white h-8 text-xs">Weather</ToggleGroupItem>
                            <ToggleGroupItem value="combined" className="data-[state=on]:bg-green-900/50 data-[state=on]:text-green-300 text-gray-400 hover:text-white h-8 text-xs">Combined</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-7xl mx-auto space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Predicted Demand</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Package className="w-8 h-8 text-blue-500" />
                                <span className="text-3xl font-bold text-white">1,240</span>
                                <span className="text-sm text-gray-500">units</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Next 7 Days Total</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Change vs Baseline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-8 h-8 text-green-500" />
                                <span className="text-3xl font-bold text-white">+18%</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Event-driven uplift</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Confidence Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Activity className="w-8 h-8 text-yellow-500" />
                                <span className="text-3xl font-bold text-white">High</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">88% Statistical Confidence</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Volatility Index</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Zap className="w-8 h-8 text-orange-500" />
                                <span className="text-3xl font-bold text-white">Med</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Moderate fluctuations expected</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Forecast Visualization */}
                <Card className="bg-[#111] border-[#333]">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Demand Forecast Over Time</CardTitle>
                                <CardDescription className="text-gray-500">
                                    Comparing historical actuals with AI-generated future demand. Shaded area represents confidence interval.
                                </CardDescription>
                            </div>
                            {/* Event markers legend could go here */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center text-xs text-gray-400">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 opacity-20 border border-purple-500"></div> Event Active
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={FORECAST_DATA}>
                                <defs>
                                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                <XAxis dataKey="date" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#aaa' }}
                                />
                                <Legend />
                                {/* Confidence Band */}
                                <Area
                                    type="monotone"
                                    dataKey="upper"
                                    dataKeyOne="lower" // Recharts Area typically uses two keys for range, or we use separate areas. 
                                    // For simplicity in this composed chart, we often use dot=false range Area if data structures support [min, max].
                                    // Here, we'll try a simpler 'Stack' approach or just use a wide stroke.
                                    // However, a common trick is to stack transparent areas, but standard way:
                                    stroke="none"
                                    fill="url(#colorConfidence)"
                                    name="Confidence Interval"
                                />

                                <Area type="monotone" dataKey="upper" stroke="none" fill="#3b82f6" fillOpacity={0.1} />
                                {/* Actually, the best way for confidence band in recharts is Range Area, but standard Area is 0-baseline.
                                    We will simulate visual band by just showing the Forecast Line and maybe ErrorBars or just the dashed line for now.
                                    Let's stick to simple lines for specific values for clarity in this iteration.
                                */}

                                <Line type="monotone" dataKey="history" stroke="#fff" strokeWidth={2} dot={{ r: 4 }} name="Historical Actuals" />
                                <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" name="AI Forecast" />

                                {/* Event Marker simulation via customized dot or reference lines */}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Breakdown & Drivers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-white">What's Driving This Forecast?</CardTitle>
                            <CardDescription className="text-gray-500">Contribution of each intelligence signal to the predicted uplift.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={DRIVER_CONTRIBUTION}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#222" />
                                        <XAxis type="number" stroke="#555" fontSize={12} />
                                        <YAxis dataKey="factor" type="category" stroke="#fff" fontSize={12} width={100} />
                                        <Tooltip cursor={{ fill: '#222' }} contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                                        <Bar dataKey="value" name="Contribution %" radius={[0, 4, 4, 0]}>
                                            {
                                                DRIVER_CONTRIBUTION.map((entry, index) => (
                                                    <cell key={`cell-${index}`} fill={entry.fill} />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333] mt-4">
                                <h4 className="text-sm font-semibold text-white mb-1">AI Insight</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Upcoming <span className="text-purple-400">city festival</span> contributes 25% of expected demand uplift, strongly supported by rising <span className="text-blue-400">Trend Intelligence</span>. Weather impact is minimal.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Forecast Table */}
                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-white">Forecast Data Table</CardTitle>
                            <CardDescription className="text-gray-500">Validation View</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[#222] hover:bg-transparent">
                                        <TableHead className="text-gray-400">Date</TableHead>
                                        <TableHead className="text-gray-400 text-right">Forecast</TableHead>
                                        <TableHead className="text-gray-400 text-right">Confidence Range</TableHead>
                                        <TableHead className="text-gray-400 text-right">Confidence</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {FORECAST_DATA.filter(d => d.forecast).map((row, i) => (
                                        <TableRow key={i} className="border-[#222] hover:bg-[#1a1a1a]">
                                            <TableCell className="font-medium text-white">{row.date}</TableCell>
                                            <TableCell className="text-right text-blue-400 font-bold">{row.forecast}</TableCell>
                                            <TableCell className="text-right text-gray-500 text-xs">{row.lower} - {row.upper}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className="text-green-400 border-green-900 bg-green-900/10">High</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Risk & Actions */}
                <div className="w-full">
                    <Card className="bg-[#151515] border border-l-4 border-l-orange-500 border-y-[#333] border-r-[#333]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg text-white font-semibold">Forecast Risk Assessment</CardTitle>
                                <CardDescription className="text-gray-400 mt-1">
                                    Uncertainty increases linearly after Jan 16 due to potential weather shift.
                                </CardDescription>
                            </div>
                            <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/dashboard/godown')}>
                                <Package className="w-4 h-4 mr-2" />
                                Check Inventory Impact
                            </Button>
                        </CardHeader>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default ForecastEnginePage;

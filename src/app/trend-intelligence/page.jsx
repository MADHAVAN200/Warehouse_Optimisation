
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, TrendingDown, Minus, Activity, AlertCircle,
    Filter, MapPin, Package, Calendar, BarChart2, Info, ArrowUpRight, ArrowDownRight,
    Zap, Wind, Search, ShoppingCart, Layers
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
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';

// Mock Data
const TREND_OVER_TIME = [
    { date: 'Jan 01', score: 45, baseline: 50 },
    { date: 'Jan 05', score: 48, baseline: 50 },
    { date: 'Jan 10', score: 55, baseline: 51 },
    { date: 'Jan 15', score: 68, baseline: 52 },
    { date: 'Jan 20', score: 75, baseline: 52 },
    { date: 'Jan 25', score: 82, baseline: 53 },
    { date: 'Jan 30', score: 80, baseline: 53 },
];

const HEATMAP_DATA = [
    { city: "New York", products: [{ name: "Bevs", score: 85 }, { name: "Snacks", score: 60 }, { name: "Home", score: 30 }, { name: "Elec", score: 45 }] },
    { city: "Austin", products: [{ name: "Bevs", score: 92 }, { name: "Snacks", score: 75 }, { name: "Home", score: 40 }, { name: "Elec", score: 20 }] },
    { city: "Chicago", products: [{ name: "Bevs", score: 55 }, { name: "Snacks", score: 50 }, { name: "Home", score: 35 }, { name: "Elec", score: 60 }] },
    { city: "San Fran", products: [{ name: "Bevs", score: 40 }, { name: "Snacks", score: 45 }, { name: "Home", score: 25 }, { name: "Elec", score: 88 }] },
];

const DRIVER_DATA = [
    { name: "Sales Velocity", value: 65, color: "bg-blue-500", icon: ShoppingCart },
    { name: "Event Overlap", value: 25, color: "bg-purple-500", icon: Calendar },
    { name: "Social Buzz", value: 10, color: "bg-pink-500", icon: Search },
];

const TrendIntelligencePage = () => {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState("beverages");
    const [timeWindow, setTimeWindow] = useState("30");

    // Helper for Heatmap Colors
    const getHeatmapColor = (score) => {
        if (score >= 80) return "bg-blue-500/90 text-white font-bold";
        if (score >= 60) return "bg-blue-500/60 text-white";
        if (score >= 40) return "bg-blue-500/30 text-gray-300";
        return "bg-blue-500/10 text-gray-500";
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground pb-20">
            {/* Header */}
            <div className="bg-[#111] border-b border-[#222] px-6 py-6">
                <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-white">Trend Intelligence</h1>
                </div>
                <p className="text-gray-400 max-w-2xl">
                    Product & city-level demand momentum signals. Normalized scores for forecasting.
                </p>
            </div>

            {/* Global Filters */}
            <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#222] px-6 py-4 shadow-md">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase">City Scope</label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger className="w-[160px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="All Cities" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="all">All Cities</SelectItem>
                                <SelectItem value="ny">New York</SelectItem>
                                <SelectItem value="austin">Austin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase">Product Category</label>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger className="w-[160px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="beverages">Beverages</SelectItem>
                                <SelectItem value="electronics">Electronics</SelectItem>
                                <SelectItem value="fashion">Fashion</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 uppercase">Trend Window</label>
                        <Select value={timeWindow} onValueChange={setTimeWindow}>
                            <SelectTrigger className="w-[140px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="Last 30 Days" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="7">Last 7 Days</SelectItem>
                                <SelectItem value="14">Last 14 Days</SelectItem>
                                <SelectItem value="30">Last 30 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 bg-yellow-900/10">
                            <Zap className="w-3 h-3 mr-1" />
                            Live Signals
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-7xl mx-auto space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Current Trend Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-bold text-white">82</span>
                                <span className="text-sm text-gray-500">/ 100</span>
                            </div>
                            <div className="mt-2 text-xs font-medium text-green-500 flex items-center">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                High Momentum
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Trend Direction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-8 h-8 text-green-500" />
                                <span className="text-2xl font-bold text-white">Rising</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">+15% vs previous 30 days</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Signal Strength</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-bold text-blue-400">94%</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">High Trust (Consistent Data)</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Forecast Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-bold text-purple-400">High</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Model heavily weighting this trend</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Analysis Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Trend Over Time Chart */}
                    <Card className="lg:col-span-2 bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-white">Trend Momentum Over Time</CardTitle>
                            <CardDescription className="text-gray-500">
                                30-day velocity verification. Markers indicate external events.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={TREND_OVER_TIME}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                    <XAxis dataKey="date" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                    <ReferenceLine x="Jan 15" stroke="orange" strokeDasharray="3 3" label={{ position: 'top', value: 'Promotion Start', fill: 'orange', fontSize: 10 }} />
                                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} name="Trend Score" />
                                    <Line type="monotone" dataKey="baseline" stroke="#555" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Historical Baseline" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Driver Breakdown */}
                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-white">What's Driving This?</CardTitle>
                            <CardDescription className="text-gray-500">Factor contribution analysis.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {DRIVER_DATA.map((driver, i) => {
                                const Icon = driver.icon;
                                return (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center text-gray-300">
                                                <Icon className="w-4 h-4 mr-2 text-gray-500" />
                                                {driver.name}
                                            </div>
                                            <span className="font-bold text-white">{driver.value}%</span>
                                        </div>
                                        <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${driver.color}`}
                                                style={{ width: `${driver.value}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333] mt-4">
                                <h4 className="text-sm font-semibold text-white mb-1">AI Explanation</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Recent momentum is primarily driven by pure <span className="text-blue-400">sales velocity</span> acceleration in the Northeast region. Event overlap impact is secondary but rising.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Heatmap & Warnings */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Heatmap */}
                    <Card className="lg:col-span-2 bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-white">Cross-City Momentum Heatmap</CardTitle>
                            <CardDescription className="text-gray-500">Quickly identify regional outliers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr>
                                            <th className="py-2 text-gray-500 font-medium">City</th>
                                            {HEATMAP_DATA[0].products.map((p, i) => (
                                                <th key={i} className="py-2 text-gray-500 font-medium text-center">{p.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {HEATMAP_DATA.map((row, i) => (
                                            <tr key={i} className="border-b border-[#222] last:border-0 hover:bg-[#1a1a1a]/50 transition-colors">
                                                <td className="py-3 font-medium text-gray-300">{row.city}</td>
                                                {row.products.map((prod, j) => (
                                                    <td key={j} className="p-2 text-center">
                                                        <div
                                                            className={`w-full py-2 rounded ${getHeatmapColor(prod.score)} cursor-pointer hover:scale-105 transition-transform`}
                                                            onClick={() => {
                                                                setSelectedCity(row.city.toLowerCase());
                                                                // In real app, this would filter the dashboard
                                                            }}
                                                        >
                                                            {prod.score}
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reliability & Actions */}
                    <div className="space-y-6">
                        {/* Warnings */}
                        <Card className="bg-[#151515] border border-l-4 border-l-yellow-500 border-y-[#333] border-r-[#333]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-yellow-500 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Data Reliability Warning
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-gray-400">
                                    San Francisco signal volatility is high due to incomplete data for the last 48 hours.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Recommended Actions</h3>
                            <Button variant="outline" className="w-full justify-start border-[#333] text-gray-300 hover:bg-[#222]" onClick={() => navigate('/dashboard/analytics')}>
                                <BarChart2 className="w-4 h-4 mr-2 text-blue-500" />
                                View Forecast
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-[#333] text-gray-300 hover:bg-[#222]" onClick={() => navigate('/dashboard/godown')}>
                                <Package className="w-4 h-4 mr-2 text-purple-500" />
                                Check Inventory
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-[#333] text-gray-300 hover:bg-[#222]" onClick={() => navigate('/event-intelligence')}>
                                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                                See Event Context
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendIntelligencePage;

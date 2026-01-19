
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CloudRain, Sun, Cloud, Wind, Thermometer, Droplets,
    MapPin, Calendar, TrendingUp, AlertTriangle, Truck,
    ShoppingCart, ArrowRight, Zap, Umbrella, Activity
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
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

// Mock Data
const WEATHER_FORECAST = [
    { day: 'Mon', date: 'Jan 12', icon: Sun, temp: 72, humidity: 45, precip: 0, condition: 'Sunny' },
    { day: 'Tue', date: 'Jan 13', icon: Cloud, temp: 68, humidity: 55, precip: 10, condition: 'Cloudy' },
    { day: 'Wed', date: 'Jan 14', icon: CloudRain, temp: 62, humidity: 75, precip: 80, condition: 'Heavy Rain' },
    { day: 'Thu', date: 'Jan 15', icon: CloudRain, temp: 60, humidity: 80, precip: 90, condition: 'Storm' },
    { day: 'Fri', date: 'Jan 16', icon: Cloud, temp: 65, humidity: 60, precip: 20, condition: 'Partly Cloudy' },
    { day: 'Sat', date: 'Jan 17', icon: Sun, temp: 70, humidity: 50, precip: 0, condition: 'Sunny' },
    { day: 'Sun', date: 'Jan 18', icon: Sun, temp: 74, humidity: 40, precip: 0, condition: 'Clear' },
    { day: 'Mon', date: 'Jan 19', icon: Sun, temp: 75, humidity: 42, precip: 0, condition: 'Sunny' },
    { day: 'Tue', date: 'Jan 20', icon: Sun, temp: 76, humidity: 40, precip: 0, condition: 'Warm' },
    { day: 'Wed', date: 'Jan 21', icon: Cloud, temp: 70, humidity: 50, precip: 15, condition: 'Overcast' },
    { day: 'Thu', date: 'Jan 22', icon: Wind, temp: 65, humidity: 45, precip: 5, condition: 'Windy' },
    { day: 'Fri', date: 'Jan 23', icon: CloudRain, temp: 62, humidity: 70, precip: 60, condition: 'Showers' },
    { day: 'Sat', date: 'Jan 24', icon: CloudRain, temp: 60, humidity: 75, precip: 70, condition: 'Light Rain' },
    { day: 'Sun', date: 'Jan 25', icon: Cloud, temp: 64, humidity: 60, precip: 20, condition: 'Clearing' },
];

const DEMAND_IMPACT_DATA = [
    { day: 'Mon', baseline: 100, impacted: 102 },
    { day: 'Tue', baseline: 100, impacted: 100 },
    { day: 'Wed', baseline: 95, impacted: 115 }, // Rain spike usually for delivery/staples
    { day: 'Thu', baseline: 95, impacted: 120 },
    { day: 'Fri', baseline: 110, impacted: 115 },
    { day: 'Sat', baseline: 120, impacted: 125 },
    { day: 'Sun', baseline: 115, impacted: 118 },
    { day: 'Mon', baseline: 100, impacted: 100 },
    { day: 'Tue', baseline: 100, impacted: 105 },
    { day: 'Wed', baseline: 95, impacted: 100 },
    { day: 'Thu', baseline: 95, impacted: 90 }, // windy sometimes drops footfall
    { day: 'Fri', baseline: 110, impacted: 112 },
    { day: 'Sat', baseline: 120, impacted: 115 }, // rain dampens weekend shopping
    { day: 'Sun', baseline: 115, impacted: 115 },
];

const CATEGORY_SENSITIVITY = [
    { category: "Umbrellas", impact: 95 },
    { category: "Comfort Food", impact: 65 },
    { category: "Hot Beverages", impact: 60 },
    { category: "Delivery Svc", impact: 45 },
    { category: "Home Ent.", impact: 30 },
    { category: "Fresh Produce", impact: -20 }, // Spoilage risk or lower footfall
    { category: "Ice Cream", impact: -45 },
    { category: "Outdoor Gear", impact: -60 },
];

const RISK_SKUS = [
    { sku: "Fresh Berries", type: "Spoilage Risk", riskLevel: "High", advice: "Reduce order qty by 20%" },
    { sku: "Raincoats", type: "Stockout Risk", riskLevel: "Medium", advice: "Request emergency transfer" },
    { sku: "Dairy Milk", type: "Delivery Delay", riskLevel: "Medium", advice: "Buffer stock check required" },
    { sku: "BBQ Charcoal", type: "Demand Drop", riskLevel: "High", advice: "Hold replenishment" },
    { sku: "Leafy Greens", type: "Spoilage Risk", riskLevel: "Medium", advice: "Check cold chain integrity" },
];

const ADVISORIES = [
    {
        title: "Increase cold-chain monitoring",
        description: "Humidity spike expected on Wed/Thu. Check reefer unit sensors.",
        severity: "high",
        action: "Check Infrastructure",
        path: "/dashboard/godown"
    },
    {
        title: "Expect delivery delays",
        description: "Heavy rain on Thursday may impact last-mile logistics efficiency by 15-20%.",
        severity: "medium",
        action: "Alert Logistics",
        path: "/logistics"
    }
];

const WeatherIntelligencePage = () => {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState("New York");
    const [forecastHorizon, setForecastHorizon] = useState("7");
    const [impactFocus, setImpactFocus] = useState("demand");

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground pb-20">
            {/* Header */}
            <div className="bg-[#111] border-b border-[#222] px-6 py-6">
                <div className="flex items-center space-x-3 mb-2">
                    <CloudRain className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-white">Weather Intelligence</h1>
                </div>
                <p className="text-gray-300 max-w-2xl">
                    Weather-driven demand and operational risk signals. Spoilage, logisitics, and footfall logic.
                </p>
            </div>

            {/* Global Filters */}
            <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#222] px-6 py-4 shadow-md">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Region / City</label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="New York">New York</SelectItem>
                                <SelectItem value="Austin">Austin</SelectItem>
                                <SelectItem value="London">London</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Forecast Horizon</label>
                        <Select value={forecastHorizon} onValueChange={setForecastHorizon}>
                            <SelectTrigger className="w-[160px] bg-[#1a1a1a] border-[#333] text-white">
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
                        <label className="text-xs font-medium text-gray-400 uppercase">Impact Focus</label>
                        <Select value={impactFocus} onValueChange={setImpactFocus}>
                            <SelectTrigger className="w-[160px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="Demand Impact" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="demand">Demand Impact</SelectItem>
                                <SelectItem value="inventory">Inventory Risk</SelectItem>
                                <SelectItem value="logistics">Logistics Risk</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="p-6 w-full space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">Weather Severity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <CloudRain className="w-8 h-8 text-yellow-500" />
                                <span className="text-2xl font-bold text-white">Moderate</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-400">Upcoming rainstorm (Thu)</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">Demand Sensitivity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-8 h-8 text-blue-500" />
                                <span className="text-2xl font-bold text-white">High</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-400">Staples & Delivery impacted</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">Spoilage Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Droplets className="w-8 h-8 text-green-500" />
                                <span className="text-2xl font-bold text-white">Low</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-400">Temp within safe range</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">Logistics Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Truck className="w-8 h-8 text-yellow-500" />
                                <span className="text-2xl font-bold text-white">Medium</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-400">Slight last-mile delays expected</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 7-Day Forecast */}
                <Card className="bg-[#111] border-[#333]">
                    <CardHeader>
                        <CardTitle className="text-white">Upcoming Weather Conditions</CardTitle>
                        <CardDescription className="text-gray-400">7-Day forecast for {selectedCity}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                            {WEATHER_FORECAST.map((day, i) => {
                                const Icon = day.icon;
                                return (
                                    <div key={i} className={`flex flex-col items-center p-3 rounded-lg border ${day.condition.includes('Rain') || day.condition.includes('Storm') ? 'bg-blue-900/10 border-blue-800/30' : 'bg-[#1a1a1a] border-[#333]'
                                        }`}>
                                        <span className="text-xs text-gray-400 mb-1">{day.date}</span>
                                        <span className="text-sm font-bold text-white mb-2">{day.day}</span>
                                        <Icon className={`w-8 h-8 mb-2 ${day.condition.includes('Sun') || day.condition.includes('Clear') ? 'text-yellow-500' :
                                            day.condition.includes('Rain') ? 'text-blue-500' : 'text-gray-400'
                                            }`} />
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-white">{day.temp}°</div>
                                            <div className="text-xs text-gray-400 flex items-center justify-center mt-1">
                                                <Droplets className="w-3 h-3 mr-1" /> {day.humidity}%
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Business Impact Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-white">Weather-Driven Expected Demand</CardTitle>
                            <CardDescription className="text-gray-400">Projected uplift/drop due to conditions.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={DEMAND_IMPACT_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                    <XAxis dataKey="day" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="impacted" stroke="#3b82f6" strokeWidth={3} name="Forecast (Weather Adj.)" />
                                    <Line type="monotone" dataKey="baseline" stroke="#555" strokeWidth={2} strokeDasharray="5 5" name="Baseline" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-white">Category Sensitivity</CardTitle>
                            <CardDescription className="text-gray-400">Impact by category.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CATEGORY_SENSITIVITY} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#222" />
                                    <XAxis type="number" stroke="#555" fontSize={12} />
                                    <YAxis dataKey="category" type="category" stroke="#fff" fontSize={12} width={80} />
                                    <Tooltip
                                        cursor={{ fill: '#222' }}
                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="impact" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Risk Panels & Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                                High-Risk SKUs
                            </CardTitle>
                            <CardDescription className="text-gray-400">Inventory requiring attention.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[#222] hover:bg-transparent">
                                        <TableHead className="text-gray-400">SKU</TableHead>
                                        <TableHead className="text-gray-400">Risk Type</TableHead>
                                        <TableHead className="text-gray-400">Risk Level</TableHead>
                                        <TableHead className="text-gray-400">Advice</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {RISK_SKUS.map((item, i) => (
                                        <TableRow key={i} className="border-[#222] hover:bg-[#1a1a1a]">
                                            <TableCell className="font-medium text-white">{item.sku}</TableCell>
                                            <TableCell className="text-gray-300">{item.type}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`${item.riskLevel === 'High' ? 'text-red-400 border-red-900 bg-red-900/10' : 'text-yellow-400 border-yellow-900 bg-yellow-900/10'
                                                    }`}>
                                                    {item.riskLevel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-300 text-xs">{item.advice}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-purple-500" />
                            Operational Advisories
                        </h2>
                        {ADVISORIES.map((advisory, idx) => (
                            <Card key={idx} className="bg-[#151515] border border-l-4 border-l-purple-500 border-y-[#333] border-r-[#333]">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg text-white font-semibold">{advisory.title}</CardTitle>
                                        <Badge variant="secondary" className={`
                                            ${advisory.severity === 'high' ? 'bg-red-900/20 text-red-400' : 'bg-yellow-900/20 text-yellow-400'}
                                        `}>
                                            {advisory.severity.toUpperCase()} PRIORITY
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-gray-300 mt-1">
                                        {advisory.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="pt-2">
                                    <Button
                                        variant="secondary"
                                        className="w-full sm:w-auto bg-[#222] hover:bg-[#333] text-white border border-[#444]"
                                        onClick={() => navigate(advisory.path)}
                                    >
                                        {advisory.action}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WeatherIntelligencePage;

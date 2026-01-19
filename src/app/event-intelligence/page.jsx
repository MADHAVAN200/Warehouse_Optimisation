
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, MapPin, Filter, TrendingUp, AlertTriangle,
    Info, ArrowRight, Activity, Thermometer, ShoppingCart,
    Truck, ArrowUpRight, ArrowDownRight, MoreHorizontal, Brain
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
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

// Mock Data
const EVENTS_DATA = [
    {
        id: 1,
        name: "City Marathon 2026",
        city: "New York",
        type: "Sports",
        date: "2026-03-15",
        impactScore: 4.8,
        affectedCategories: ["Beverages", "Snacks", "First Aid"],
        confidence: 94,
        description: "Annual city marathon with 50k+ participants. Road closures expected."
    },
    {
        id: 2,
        name: "Spring Music Festival",
        city: "Austin",
        type: "Festival",
        date: "2026-03-20",
        impactScore: 4.2,
        affectedCategories: ["Alcohol", "Ready-to-Eat", "Camping"],
        confidence: 88,
        description: "3-day outdoor music festival. High tourist influx."
    },
    {
        id: 3,
        name: "Tech Conference Global",
        city: "San Francisco",
        type: "Conference",
        date: "2026-04-05",
        impactScore: 3.5,
        affectedCategories: ["Electronics", "Premium Coffee"],
        confidence: 91,
        description: "Major tech summit. Increased downtown foot traffic."
    },
    {
        id: 4,
        name: "Holiday Parade",
        city: "New York",
        type: "Holiday",
        date: "2026-11-26",
        impactScore: 4.5,
        affectedCategories: ["Toys", "Seasonal", "Bakery"],
        confidence: 95,
        description: "Annual Thanksgiving parade. Massive crowd density in Midtown."
    },
    {
        id: 5,
        name: "Comic Con",
        city: "San Diego",
        type: "Conference",
        date: "2026-07-23",
        impactScore: 3.8,
        affectedCategories: ["Snacks", "Costumes", "Electronics"],
        confidence: 85,
        description: "Large scale pop-culture convention. High youth demographic."
    },
    {
        id: 6,
        name: "Pride March",
        city: "San Francisco",
        type: "Festival",
        date: "2026-06-28",
        impactScore: 4.7,
        affectedCategories: ["Beverages", "Apparel", "Party Supplies"],
        confidence: 92,
        description: "City-wide celebration. Expect huge demand spikes in downtown areas."
    },
    {
        id: 7,
        name: "Super Bowl Sunday",
        city: "Los Angeles",
        type: "Sports",
        date: "2026-02-08",
        impactScore: 5.0,
        affectedCategories: ["Snacks", "Beverages", "Pizza"],
        confidence: 99,
        description: "National sporting event. Extreme demand for party foods."
    },
    {
        id: 8,
        name: "Summer Food Fest",
        city: "Chicago",
        type: "Festival",
        date: "2026-07-10",
        impactScore: 3.2,
        affectedCategories: ["Fresh Ingredients", "Beverages"],
        confidence: 78,
        description: "Local culinary event. Moderate impact on surrounding stores."
    },
    {
        id: 9,
        name: "University Graduation",
        city: "Boston",
        type: "Ceremony",
        date: "2026-05-20",
        impactScore: 3.0,
        affectedCategories: ["Gifts", "Floral", "Restaurants"],
        confidence: 82,
        description: "Multiple university commencements. High demand for gifts and dining."
    }
];

const DEMAND_IMPACT_DATA = [
    { day: "Day -3", baseline: 100, event: 102 },
    { day: "Day -2", baseline: 100, event: 110 },
    { day: "Day -1", baseline: 105, event: 145 },
    { day: "Day 0", baseline: 110, event: 180 },
    { day: "Day +1", baseline: 100, event: 120 },
    { day: "Day +2", baseline: 95, event: 98 },
    { day: "Day +3", baseline: 100, event: 100 },
];

const CATEGORY_SENSITIVITY_DATA = [
    { category: "Beverages", sensitivity: 95 },
    { category: "Snacks", sensitivity: 82 },
    { category: "Fresh Food", sensitivity: 60 },
    { category: "Household", sensitivity: 20 },
    { category: "Electronics", sensitivity: 15 },
];

const INSIGHTS_DATA = [
    {
        id: 1,
        title: "Stock staples 2 days earlier",
        description: "Historical data shows 45% demand spike in Water & Energy Bars 48h before the Marathon.",
        severity: "high", // high, medium, low
        action: "Check Inventory",
        path: "/dashboard/godown"
    },
    {
        id: 2,
        title: "Avoid overstocking perishables",
        description: "Event duration is short (6h). Fresh food demand normalization is rapid post-event.",
        severity: "medium",
        action: "View Forecast",
        path: "/dashboard/analytics"
    }
];

const EventIntelligencePage = () => {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState("New York");
    const [eventType, setEventType] = useState("all");
    const [dateRange, setDateRange] = useState("30");
    const [impactThreshold, setImpactThreshold] = useState([3]);
    const [expandedEventId, setExpandedEventId] = useState(null);

    const toggleEventDetails = (id) => {
        setExpandedEventId(expandedEventId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground pb-20">
            {/* 2. PAGE HEADER */}
            <div className="bg-[#111] border-b border-[#222] px-6 py-6">
                <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-white">Event Intelligence</h1>
                </div>
                <p className="text-gray-300 max-w-2xl">
                    City-level events influencing demand signals. Analyze impact to optimize inventory and staffing.
                </p>
            </div>

            {/* 3. GLOBAL FILTERS BAR */}
            <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#222] px-6 py-4 shadow-md">
                <div className="flex flex-wrap items-center gap-4">

                    {/* City Selector */}
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Region / City</label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="New York">New York</SelectItem>
                                <SelectItem value="Austin">Austin</SelectItem>
                                <SelectItem value="San Francisco">San Francisco</SelectItem>
                                <SelectItem value="Chicago">Chicago</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Event Type Filter */}
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Event Type</label>
                        <Select value={eventType} onValueChange={setEventType}>
                            <SelectTrigger className="w-[160px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="sports">Sports</SelectItem>
                                <SelectItem value="festival">Festival</SelectItem>
                                <SelectItem value="concert">Concert</SelectItem>
                                <SelectItem value="holiday">Public Holiday</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range Picker */}
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Time Horizon</label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[140px] bg-[#1a1a1a] border-[#333] text-white">
                                <SelectValue placeholder="Next 30 Days" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                <SelectItem value="7">Next 7 Days</SelectItem>
                                <SelectItem value="14">Next 14 Days</SelectItem>
                                <SelectItem value="30">Next 30 Days</SelectItem>
                                <SelectItem value="90">Next Quarter</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Impact Threshold Slider */}
                    <div className="flex flex-col space-y-1.5 w-[200px] px-2">
                        <label className="text-xs font-medium text-gray-400 uppercase flex justify-between">
                            <span>Min Impact Score</span>
                            <span className="text-blue-400">{impactThreshold[0]}</span>
                        </label>
                        <Slider
                            value={impactThreshold}
                            onValueChange={setImpactThreshold}
                            max={5}
                            step={0.5}
                            className="py-2"
                        />
                    </div>

                </div>
            </div>

            <div className="p-6 w-full space-y-8">

                {/* 4. EVENT IMPACT SUMMARY (KPI CARDS) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-[#111] border-[#333] hover:border-blue-500/30 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">High-Impact Events</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">3</div>
                            <p className="text-xs text-gray-400 mt-1">Impact score ≥ {impactThreshold}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333] hover:border-blue-500/30 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">Peak Risk Window</CardTitle>
                            <Activity className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">Mar 15 - 20</div>
                            <p className="text-xs text-gray-400 mt-1">Marathon + Festival overlap</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333] hover:border-blue-500/30 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">Affected Category</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">Beverages</div>
                            <p className="text-xs text-gray-400 mt-1">Sensitive to crowd events</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111] border-[#333] hover:border-blue-500/30 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-300">Forecast Sensitivity</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">High</div>
                            <p className="text-xs text-gray-400 mt-1">Historical correlation: 0.85</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 5. UPCOMING EVENTS TABLE */}
                <Card className="bg-[#111] border-[#333]">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Upcoming Events Queue</CardTitle>
                        <CardDescription className="text-gray-400">Operationally actionable event details for the selected region.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-[#222] hover:bg-transparent">
                                    <TableHead className="text-gray-300">Event Name</TableHead>
                                    <TableHead className="text-gray-300">City</TableHead>
                                    <TableHead className="text-gray-300">Type</TableHead>
                                    <TableHead className="text-gray-300">Date</TableHead>
                                    <TableHead className="text-gray-300 text-right">AI Impact (0-5)</TableHead>
                                    <TableHead className="text-gray-300 text-right">Confidence</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {EVENTS_DATA.filter(e => e.impactScore >= impactThreshold[0]).map((event) => (
                                    <React.Fragment key={event.id}>
                                        <TableRow
                                            className="border-[#222] hover:bg-[#1a1a1a] cursor-pointer transition-colors"
                                            onClick={() => toggleEventDetails(event.id)}
                                        >
                                            <TableCell className="font-medium text-white">{event.name}</TableCell>
                                            <TableCell className="text-gray-200">{event.city}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-gray-700 text-gray-300">
                                                    {event.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-200">{event.date}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <span className={`font-bold ${event.impactScore >= 4 ? 'text-red-500' :
                                                        event.impactScore >= 3 ? 'text-yellow-500' : 'text-green-500'
                                                        }`}>
                                                        {event.impactScore}
                                                    </span>
                                                    <div className="w-16 h-1.5 bg-[#333] rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${event.impactScore >= 4 ? 'bg-red-500' :
                                                                event.impactScore >= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                                                }`}
                                                            style={{ width: `${(event.impactScore / 5) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-gray-200">{event.confidence}%</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {expandedEventId === event.id && (
                                            <TableRow className="border-[#222] bg-[#151515] hover:bg-[#151515]">
                                                <TableCell colSpan={7} className="p-0">
                                                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-accordion-down">
                                                        <div className="space-y-3">
                                                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Context</h4>
                                                            <p className="text-sm text-gray-200">{event.description}</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {event.affectedCategories.map((cat, i) => (
                                                                    <Badge key={i} className="bg-blue-900/20 text-blue-400 border-blue-800/30">
                                                                        {cat}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Metrics</h4>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="bg-[#1a1a1a] p-3 rounded-md border border-[#333]">
                                                                    <div className="text-xs text-gray-400">Exp. Duration</div>
                                                                    <div className="text-sm font-medium text-white">3 Days</div>
                                                                </div>
                                                                <div className="bg-[#1a1a1a] p-3 rounded-md border border-[#333]">
                                                                    <div className="text-xs text-gray-400">Hist. Lift</div>
                                                                    <div className="text-sm font-medium text-green-400">+12%</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 flex flex-col justify-between">
                                                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</h4>
                                                            <div className="space-y-2">
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full justify-start border-[#333] hover:bg-[#222] text-gray-200"
                                                                    onClick={() => navigate('/dashboard/analytics')}
                                                                >
                                                                    <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                                                                    View Forecast Impact
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full justify-start border-[#333] hover:bg-[#222] text-gray-200"
                                                                    onClick={() => navigate('/dashboard/godown')}
                                                                >
                                                                    <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                                                                    Check Inventory Risks
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* 6. DEMAND IMPACT ANALYTICS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-[#111] border-[#333]">
                        <CardHeader>
                            <CardTitle className="text-white">Demand Impact Timeline</CardTitle>
                            <CardDescription className="text-gray-400">Projected demand relative to baseline before, during, and after event.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={DEMAND_IMPACT_DATA}>
                                    <defs>
                                        <linearGradient id="colorEvent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                    <XAxis dataKey="day" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} domain={[80, 200]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="event"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorEvent)"
                                        name="Projected Demand"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="baseline"
                                        stroke="#555"
                                        strokeDasharray="5 5"
                                        fill="transparent"
                                        name="Baseline"
                                    />
                                    <Legend />
                                </AreaChart>
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
                                <BarChart data={CATEGORY_SENSITIVITY_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#222" />
                                    <XAxis type="number" stroke="#555" fontSize={12} />
                                    <YAxis dataKey="category" type="category" stroke="#fff" fontSize={12} width={80} />
                                    <Tooltip
                                        cursor={{ fill: '#222' }}
                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="sensitivity" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* 7. EVENT-TO-ACTION INSIGHTS */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-purple-500" />
                        AI Generated Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {INSIGHTS_DATA.map((insight) => (
                            <Card key={insight.id} className="bg-[#151515] border border-l-4 border-l-purple-500 border-y-[#333] border-r-[#333]">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg text-white font-semibold">{insight.title}</CardTitle>
                                        <Badge variant="secondary" className={`
                                    ${insight.severity === 'high' ? 'bg-red-900/20 text-red-400' : 'bg-yellow-900/20 text-yellow-400'}
                                `}>
                                            {insight.severity.toUpperCase()} PRIORITY
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-gray-300 mt-1">
                                        {insight.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="pt-2">
                                    <Button
                                        variant="secondary"
                                        className="w-full sm:w-auto bg-[#222] hover:bg-[#333] text-white border border-[#444]"
                                        onClick={() => navigate(insight.path)}
                                    >
                                        {insight.action}
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

export default EventIntelligencePage;

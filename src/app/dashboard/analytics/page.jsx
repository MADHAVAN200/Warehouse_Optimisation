"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Leaf, DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
// Expanded data for more realistic charts and metrics
const analyticsData = {
    kpis: {
        wasteReduced: { value: 1062, unit: 'kg', trend: 8.5, trendDirection: 'up' },
        revenueRecovered: { value: 4190400, unit: '₹', trend: 12.2, trendDirection: 'up' },
        co2Saved: { value: 1.2, unit: 'tons', trend: 5.1, trendDirection: 'up' },
        vendorScore: { value: 4.7, unit: '/ 5', trend: 0.2, trendDirection: 'up' },
    },
    goalProgress: {
        target: 50, // 50% target for this period
        current: 38, // 38% achieved
    },
    wasteRecoveryFlow: {
        sources: {
            vendors: 680,
            walmart: 382,
        },
        methods: {
            interStoreTransfers: 420,
            flashSales: 380,
            markdowns: 262,
        },
        benefits: {
            revenueRecovered: 4190400,
            wasteReduced: 1062,
        }
    },
    categoryPerformance: [
        { name: 'Fresh Produce', efficiency: 95, color: 'bg-green-500' },
        { name: 'Dairy & Eggs', efficiency: 92, color: 'bg-blue-500' },
        { name: 'Seafood', efficiency: 88, color: 'bg-cyan-500' },
        { name: 'Bakery', efficiency: 85, color: 'bg-yellow-500' },
    ],
    topVendors: [
        { name: "Green Valley Farms", score: 4.9, wastePrevented: 450 },
        { name: "Ocean Fresh Seafood", score: 4.8, wastePrevented: 320 },
        { name: "Sunrise Dairy Co.", score: 4.7, wastePrevented: 280 },
    ],
    environmentalImpact: [
        { name: "Water Saved", value: "15,420", unit: "gallons", color: "text-blue-500" },
        { name: "Energy Saved", value: "2,340", unit: "kWh", color: "text-yellow-500" },
        { name: "Landfill Diverted", value: "1.8", unit: "tons", color: "text-green-500" },
    ],
    methodEffectiveness: {
        interStoreTransfers: 94,
        flashSales: 87,
        markdowns: 76
    }
};
// Reusable Stat Card for KPIs
const StatCard = ({ icon, title, value, unit, trend, trendDirection }) => (<Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-slate-900">{unit === '₹' ? `₹${value.toLocaleString()}` : value.toLocaleString()}{unit !== '₹' && <span className="text-2xl font-medium text-slate-500">{unit}</span>}</div>
      <div className="flex items-center text-xs text-slate-500 mt-1">
        {trendDirection === 'up' ? <TrendingUp className="w-4 h-4 text-green-500 mr-1"/> : <TrendingDown className="w-4 h-4 text-red-500 mr-1"/>}
        <span className={trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}>
          {trend}%
        </span>
        <span>&nbsp;vs last month</span>
      </div>
    </CardContent>
  </Card>);
// Radial Progress Chart (no need for old Sankey implementation as we've replaced it)
// Radial Progress Chart
const RadialProgress = ({ progress, size = 120, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100 * circumference);
    return (<div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle stroke="#e2e8f0" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2}/>
        <circle stroke="#ceb600ff" fill="transparent" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} r={radius} cx={size / 2} cy={size / 2} className="transition-all duration-1000 ease-out" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white-800">{progress}%</span>
      </div>
    </div>);
};
// --- MAIN ANALYTICS PAGE COMPONENT ---
// Sankey Diagram Component
const SankeyDiagram = () => {
    const [hoveredFlow, setHoveredFlow] = useState(null);
    // Generate curved path for links (SankeyMATIC style)
    const generateLinkPath = (x0, y0, x1, y1, height) => {
        const curvature = 0.5;
        const xi = (1 - curvature) * x0 + curvature * x1;
        const x2 = (1 - curvature) * x1 + curvature * x0;
        return `
      M ${x0} ${y0 - height / 2}
      C ${xi} ${y0 - height / 2}, ${x2} ${y1 - height / 2}, ${x1} ${y1 - height / 2}
      L ${x1} ${y1 + height / 2}
      C ${x2} ${y1 + height / 2}, ${xi} ${y0 + height / 2}, ${x0} ${y0 + height / 2}
      Z
    `;
    };
    // Raw flow data (similar to SankeyMATIC format)
    const flowData = [
        // Sources to Methods
        { source: 'Vendors', target: 'Inter-Store Transfers', value: 800 },
        { source: 'Vendors', target: 'Flash Sales', value: 700 },
        { source: 'Vendors', target: 'Markdowns', value: 900 },
        { source: 'Walmart Stores', target: 'Inter-Store Transfers', value: 1300 },
        { source: 'Walmart Stores', target: 'Flash Sales', value: 1100 },
        { source: 'Walmart Stores', target: 'Markdowns', value: 1200 },
        // Methods to Outcomes
        { source: 'Inter-Store Transfers', target: 'Revenue Recovered', value: 1680 },
        { source: 'Inter-Store Transfers', target: 'Waste Reduced', value: 300 },
        { source: 'Inter-Store Transfers', target: 'Waste Loss', value: 120 },
        { source: 'Flash Sales', target: 'Revenue Recovered', value: 1440 },
        { source: 'Flash Sales', target: 'Waste Reduced', value: 240 },
        { source: 'Flash Sales', target: 'Waste Loss', value: 120 },
        { source: 'Markdowns', target: 'Revenue Recovered', value: 1080 },
        { source: 'Markdowns', target: 'Waste Reduced', value: 460 },
        { source: 'Markdowns', target: 'Waste Loss', value: 560 }
    ];
    // Node colors and metadata
    const nodeConfig = {
        'Vendors': { color: '#6b7280', money: null, yoy: null },
        'Walmart Stores': { color: '#6b7280', money: null, yoy: null },
        'Inter-Store Transfers': { color: '#8b5cf6', money: null, yoy: null },
        'Flash Sales': { color: '#f59e0b', money: null, yoy: null },
        'Markdowns': { color: '#ef4444', money: null, yoy: null },
        'Revenue Recovered': { color: '#10b981', money: '₹840K', yoy: '+12% Y/Y' },
        'Waste Reduced': { color: '#0ea5e9', money: '1.8K kg', yoy: '+8% Y/Y' },
        'Waste Loss': { color: '#dc2626', money: '₹160K', yoy: '-15% Y/Y' }
    };
    // Calculate Sankey layout
    const sankeyLayout = useMemo(() => {
        // Step 1: Build node graph
        const nodeMap = new Map();
        const links = [];
        flowData.forEach(flow => {
            if (!nodeMap.has(flow.source)) {
                nodeMap.set(flow.source, {
                    name: flow.source,
                    sourceLinks: [],
                    targetLinks: [],
                    value: 0,
                    level: null
                });
            }
            if (!nodeMap.has(flow.target)) {
                nodeMap.set(flow.target, {
                    name: flow.target,
                    sourceLinks: [],
                    targetLinks: [],
                    value: 0,
                    level: null
                });
            }
            const link = {
                source: flow.source,
                target: flow.target,
                value: flow.value
            };
            nodeMap.get(flow.source).sourceLinks.push(link);
            nodeMap.get(flow.target).targetLinks.push(link);
            links.push(link);
        });
        // Step 2: Assign levels (columns)
        const nodes = Array.from(nodeMap.values());
        // Sources (no incoming links)
        nodes.filter(n => n.targetLinks.length === 0).forEach(n => n.level = 0);
        // Intermediate nodes
        nodes.filter(n => n.targetLinks.length > 0 && n.sourceLinks.length > 0).forEach(n => n.level = 1);
        // Sinks (no outgoing links)
        nodes.filter(n => n.sourceLinks.length === 0).forEach(n => n.level = 2);
        // Step 3: Calculate node values
        nodes.forEach(node => {
            node.value = Math.max(node.sourceLinks.reduce((sum, link) => sum + link.value, 0), node.targetLinks.reduce((sum, link) => sum + link.value, 0));
        });
        // Step 4: Position nodes within levels
        const levelGroups = [[], [], []];
        nodes.forEach(node => {
            if (node.level !== null) {
                levelGroups[node.level].push(node);
            }
        });
        const nodeHeight = 280;
        const nodeSpacing = 15;
        const maxValue = Math.max(...nodes.map(n => n.value));
        const heightScale = nodeHeight / (maxValue * 1.6);
        levelGroups.forEach((levelNodes, levelIndex) => {
            let totalHeight = levelNodes.reduce((sum, node) => sum + (node.value * heightScale) + nodeSpacing, 0) - nodeSpacing;
            let currentY = (nodeHeight - totalHeight) / 2;
            levelNodes.forEach(node => {
                node.x = levelIndex * 220 + 90;
                node.y = currentY + 20;
                node.height = node.value * heightScale;
                node.width = 20;
                currentY += node.height + nodeSpacing;
            });
        });
        // Step 5: Calculate link paths
        const linkPaths = links.map(link => {
            const sourceNode = nodes.find(n => n.name === link.source);
            const targetNode = nodes.find(n => n.name === link.target);
            const sourceY = sourceNode.y + sourceNode.height / 2;
            const targetY = targetNode.y + targetNode.height / 2;
            const linkHeight = (link.value * heightScale);
            return {
                ...link,
                sourceNode,
                targetNode,
                sourceY,
                targetY,
                linkHeight,
                path: generateLinkPath(sourceNode.x + sourceNode.width, sourceY, targetNode.x, targetY, linkHeight)
            };
        });
        return { nodes, links: linkPaths };
    }, [flowData]);
    return (<div className="w-full h-96 bg-white relative overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 700 320" style={{ background: 'white' }}>
        <defs>
          {/* Gradients for different flow types */}
          <linearGradient id="sourceFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6b7280" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#6b7280" stopOpacity="0.3"/>
          </linearGradient>
          <linearGradient id="positiveFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.3"/>
          </linearGradient>
          <linearGradient id="lossFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3"/>
          </linearGradient>
        </defs>
        
        {/* Render links */}
        {sankeyLayout.links.map((link, index) => {
            let fillGradient = 'url(#sourceFlow)';
            if (link.sourceNode?.level === 0)
                fillGradient = 'url(#sourceFlow)';
            else if (link.target === 'Waste Loss')
                fillGradient = 'url(#lossFlow)';
            else
                fillGradient = 'url(#positiveFlow)';
            return (<path key={index} d={link.path} fill={fillGradient} stroke="none" className="transition-opacity duration-200 cursor-pointer hover:opacity-90" onMouseEnter={() => setHoveredFlow(link)} onMouseLeave={() => setHoveredFlow(null)}/>);
        })}
        
        {/* Render nodes */}
        {sankeyLayout.nodes.map((node, index) => (<g key={index}>
            {/* Node rectangle */}
            <rect x={node.x} y={node.y} width={node.width} height={node.height} fill={nodeConfig[node.name]?.color || '#6b7280'} rx="2"/>
            
            {/* Node label */}
            <text x={node.level === 2 ? node.x + node.width + 10 : node.x - 10} y={node.y + node.height / 2 - 4} textAnchor={node.level === 2 ? 'start' : 'end'} className="fill-gray-800 font-medium" style={{ fontSize: '13px' }}>
              {node.name}
            </text>
            
            {/* Node value */}
            <text x={node.level === 2 ? node.x + node.width + 10 : node.x - 10} y={node.y + node.height / 2 + 12} textAnchor={node.level === 2 ? 'start' : 'end'} className="fill-gray-700 font-semibold" style={{ fontSize: '12px' }}>
              {nodeConfig[node.name]?.money || `${node.value.toLocaleString()}`}
            </text>
            
            {/* Y/Y growth for outcomes */}
            {node.level === 2 && nodeConfig[node.name]?.yoy && (<text x={node.x + node.width + 10} y={node.y + node.height / 2 + 26} textAnchor="start" className="fill-gray-500" style={{ fontSize: '11px' }}>
                {nodeConfig[node.name].yoy}
              </text>)}
          </g>))}
      </svg>
      
      {/* Hover tooltip */}
      {hoveredFlow && (<div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-2 rounded-md text-sm shadow-lg z-10">
          <div className="font-medium">
            {hoveredFlow.source} → {hoveredFlow.target}
          </div>
          <div className="text-xs opacity-75">{hoveredFlow.value.toLocaleString()} units</div>
        </div>)}
    </div>);
};
export default function AnalyticsPage() {
    const [timeframe, setTimeframe] = useState("90D");
    return (<div className="min-h-screen bg-slate-50 text-slate-900 relative">
      {/* Walmart Spark Background Motif */}
      <div className="absolute top-0 right-0 h-full w-1/2 bg-no-repeat bg-right-top opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230071ce' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
      <main className="p-4 md:p-8 max-w-screen-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors mb-2">
              <ArrowLeft className="w-4 h-4"/>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold text-slate-900">
              OptiFresh<span className="text-blue-600"> Analytics</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 p-1 bg-white/60 border border-slate-200/60 rounded-lg backdrop-blur-sm">
            {["30D", "90D", "YTD", "ALL"].map(t => (<Button key={t} onClick={() => setTimeframe(t)} variant={timeframe === t ? "default" : "ghost"} size="sm" className={cn(timeframe === t && 'bg-blue-600 text-white shadow')}>
                {t}
              </Button>))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Leaf className="w-6 h-6 text-green-500"/>} title="Waste Reduced" value={analyticsData.kpis.wasteReduced.value} unit=" kg" trend={analyticsData.kpis.wasteReduced.trend} trendDirection={analyticsData.kpis.wasteReduced.trendDirection}/>
          <StatCard icon={<DollarSign className="w-6 h-6 text-blue-500"/>} title="Revenue Recovered" value={analyticsData.kpis.revenueRecovered.value} unit="₹" trend={analyticsData.kpis.revenueRecovered.trend} trendDirection={analyticsData.kpis.revenueRecovered.trendDirection}/>
          <StatCard icon={<TrendingUp className="w-6 h-6 text-purple-500"/>} title="CO₂ Emission Saved" value={analyticsData.kpis.co2Saved.value} unit=" tons" trend={analyticsData.kpis.co2Saved.trend} trendDirection={analyticsData.kpis.co2Saved.trendDirection}/>
          <StatCard icon={<Users className="w-6 h-6 text-orange-500"/>} title="Avg. Vendor Score" value={analyticsData.kpis.vendorScore.value} unit="/ 5" trend={analyticsData.kpis.vendorScore.trend} trendDirection={analyticsData.kpis.vendorScore.trendDirection}/>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Advanced Sankey Diagram) */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-slate-200/60 h-full bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">OptiFresh Value Flow</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <SankeyDiagram />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="shadow-lg border-slate-200/60 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center"><Target className="w-5 h-5 mr-2"/>2030 Goal Progress</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-around gap-4">
                <RadialProgress progress={analyticsData.goalProgress.current}/>
                <div>
                  <p className="text-4xl font-bold">{analyticsData.goalProgress.current}% <span className="text-2xl font-normal opacity-80">of Target</span></p>
                  <p className="text-sm opacity-90 mt-1">Currently ahead of schedule for 2030 sustainability targets.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-slate-200/60">
              <CardHeader><CardTitle>Category Efficiency</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.categoryPerformance.map(cat => (<div key={cat.name}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="font-medium text-slate-700">{cat.name}</span>
                      <span className="font-semibold text-slate-800">{cat.efficiency}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className={cn("h-2.5 rounded-full", cat.color)} style={{ width: `${cat.efficiency}%` }}></div>
                    </div>
                  </div>))}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="shadow-lg border-slate-200/60">
                <CardHeader><CardTitle>Top Performing Vendors</CardTitle><CardDescription>By sustainability score & waste prevention</CardDescription></CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {analyticsData.topVendors.map(vendor => (<li key={vendor.name} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{vendor.name}</p>
                                    <p className="text-xs text-slate-500">Waste Prevented: <span className="font-medium text-green-600">{vendor.wastePrevented} kg</span></p>
                                </div>
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">{vendor.score} ★</Badge>
                            </li>))}
                    </ul>
                </CardContent>
            </Card>
            <Card className="shadow-lg border-slate-200/60">
                <CardHeader><CardTitle>Environmental Impact Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {analyticsData.environmentalImpact.map(impact => (<div key={impact.name} className="flex items-center justify-between p-3 bg-slate-100/70 rounded-lg">
                            <span className={cn("font-semibold", impact.color)}>{impact.name}</span>
                            <p className="font-bold text-slate-800">{impact.value} <span className="text-sm font-normal text-slate-600">{impact.unit}</span></p>
                        </div>))}
                </CardContent>
            </Card>
            <Card className="shadow-lg border-slate-200/60">
                <CardHeader><CardTitle>Action Effectiveness</CardTitle><CardDescription>Success rate of waste reduction actions</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between"><p>Inter-Store Transfers</p><p className="font-bold">94% <span className="text-sm font-normal text-slate-500">Success</span></p></div>
                    <div className="flex items-center justify-between"><p>Flash Sales</p><p className="font-bold">87% <span className="text-sm font-normal text-slate-500">Sell-through</span></p></div>
                    <div className="flex items-center justify-between"><p>Markdowns</p><p className="font-bold">76% <span className="text-sm font-normal text-slate-500">Cleared</span></p></div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>);
}

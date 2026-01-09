"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Package, AlertTriangle, MapPin, Clock, ArrowLeft, DollarSign, MoveRight, CheckSquare, Trash2, TrendingUp, List, X } from "lucide-react";
import { cn } from "@/lib/utils";
// --- DATA STRUCTURES ---
const godownItems = [
    { id: "gd-005", name: "Imported Cheese", category: "chilled", zone: "Rack C-03", temp: "3°C", freshness: 65, quantity: "50 kg", expiry: "2025-08-04", risk: "critical", value: 95000, status: 'Temp Fluctuation', image: '/cheese.jpg' },
    { id: "gd-007", name: "Fresh Paneer", category: "chilled", zone: "Rack C-08", temp: "4°C", freshness: 55, quantity: "30 kg", expiry: "2025-08-07", risk: "critical", value: 22000, status: 'Nearing Expiry', image: '/paneer.jpg' },
    { id: "gd-004", name: "Fresh Salmon", category: "chilled", zone: "Rack C-03", temp: "1°C", freshness: 72, quantity: "45 kg", expiry: "2025-08-12", risk: "medium", value: 78000, status: 'Optimal', image: '/images/salmon.jpg' },
    { id: "gd-002", name: "Organic Milk", category: "chilled", zone: "Rack C-05", temp: "2°C", freshness: 88, quantity: "150 L", expiry: "2025-08-20", risk: "low", value: 12000, status: 'Optimal', image: '/images/milk.jpg' },
    { id: "gd-001", name: "Frozen Berries", category: "frozen", zone: "Freezer F-12", temp: "-15°C", freshness: 95, quantity: "200 kg", expiry: "2026-06-15", risk: "low", value: 45000, status: 'Optimal', image: '/images/berries.jpg' },
    { id: "gd-003", name: "Canned Tomatoes", category: "ambient", zone: "Shelf A-34", temp: "20°C", freshness: 98, quantity: "500 units", expiry: "2026-12-31", risk: "low", value: 25000, status: 'Optimal', image: '/images/tomatoes.jpg' },
    { id: "gd-006", name: "Basmati Rice", category: "ambient", zone: "Shelf A-21", temp: "21°C", freshness: 99, quantity: "1000 kg", expiry: "2027-01-01", risk: "low", value: 120000, status: 'Optimal', image: '/images/rice.jpg' },
];
// --- HELPER FUNCTIONS & COMPONENTS ---
const getExpiryInfo = (expiryDateStr) => {
    const expiryDate = new Date(expiryDateStr);
    const today = new Date("2025-08-05T23:00:03");
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
        days: diffDays,
        text: diffDays < 0 ? `Expired ${Math.abs(diffDays)}d ago` : (diffDays <= 30 ? `in ${diffDays} days` : expiryDate.toLocaleDateString('en-GB')),
        color: diffDays < 0 ? 'text-red-600 font-bold' : (diffDays <= 7 ? 'text-red-500 font-medium' : (diffDays <= 30 ? 'text-yellow-600 font-medium' : 'text-slate-600')),
        isUrgent: diffDays <= 30
    };
};
const AnimatedNumber = ({ value, isCurrency = false }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const valueRef = useRef(0);
    useEffect(() => {
        let startTime;
        const animationDuration = 1000;
        const startValue = valueRef.current;
        const animate = (timestamp) => {
            if (!startTime)
                startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / animationDuration, 1);
            const easeOutPercentage = 1 - Math.pow(1 - percentage, 3);
            const currentValue = startValue + (value - startValue) * easeOutPercentage;
            if (progress < animationDuration) {
                setDisplayValue(currentValue);
                requestAnimationFrame(animate);
            }
            else {
                setDisplayValue(value);
            }
        };
        requestAnimationFrame(animate);
        return () => { valueRef.current = value; };
    }, [value]);
    const formattedValue = isCurrency ? `₹${Math.round(displayValue).toLocaleString('en-IN')}` : Math.round(displayValue).toLocaleString('en-IN');
    return <span>{formattedValue}</span>;
};
const KpiCard = ({ title, value, unit = "", children }) => (<Card className="bg-white/60 backdrop-blur-md border-white/50 shadow-sm">
      <CardHeader className="pb-2"><CardDescription>{title}</CardDescription><CardTitle className="text-3xl font-bold text-blue-900">{value}<span className="text-xl font-medium text-slate-500">{unit}</span></CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>);
const ItemDetailPanel = ({ item, onClose }) => {
    if (!item)
        return null;
    const expiry = getExpiryInfo(item.expiry);
    return (<>
            <div onClick={onClose} className="fixed inset-0 bg-black/60 z-40 animate-fade-in"/>
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl animate-slide-in-right">
                <div className="flex flex-col h-full">
                    {/* UPDATED: Image at the top */}
                    <div className="flex-shrink-0 h-48 bg-slate-200 relative">
                        <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white hover:text-white">
                            <X className="w-5 h-5"/>
                        </Button>
                        <div className="absolute bottom-4 left-4">
                             <h2 className="text-2xl font-bold text-white shadow-lg">{item.name}</h2>
                             <p className="text-sm text-slate-200">{item.id} • {item.zone}</p>
                        </div>
                    </div>
                    
                    <div className="flex-grow p-6 overflow-y-auto space-y-6">
                        <Card className="bg-slate-50 border-slate-200">
                            <CardHeader><CardTitle className="text-base">Key Metrics</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="text-center"><p className="text-3xl font-bold text-blue-600">{item.freshness}%</p><p className="text-xs text-slate-500">Freshness</p></div>
                                <div className="text-center"><p className={cn("text-2xl font-bold", expiry.color)}>{expiry.text.split(' ')[0]}</p><p className="text-xs text-slate-500">{expiry.text.includes("days") || expiry.text.includes("ago") ? "Expiry Status" : "Expires On"}</p></div>
                            </CardContent>
                        </Card>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-800">Details</h3>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between p-2 rounded-md hover:bg-slate-100"><span>Value:</span><span className="font-medium">₹{item.value.toLocaleString('en-IN')}</span></div>
                                <div className="flex justify-between p-2 rounded-md hover:bg-slate-100"><span>Quantity:</span><span className="font-medium">{item.quantity}</span></div>
                                <div className="flex justify-between p-2 rounded-md hover:bg-slate-100"><span>Current Temp:</span><span className="font-medium">{item.temp}</span></div>
                                <div className="flex justify-between p-2 rounded-md hover:bg-slate-100"><span>Risk Level:</span><span className="font-medium capitalize">{item.risk}</span></div>
                                <div className="flex justify-between p-2 rounded-md hover:bg-slate-100"><span>Status:</span><Badge variant={item.status === 'Optimal' ? 'default' : 'secondary'} className={cn(item.status === 'Optimal' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800")}>{item.status}</Badge></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t bg-slate-50 space-y-2 flex-shrink-0">
                         <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white"><MoveRight className="w-4 h-4 mr-2"/>Move to Store Floor</Button>
                         <div className="flex gap-2">
                            <Button size="lg" variant="outline" className="flex-1 bg-white"><CheckSquare className="w-4 h-4 mr-2"/>Perform Quality Check</Button>
                            <Button size="lg" variant="destructive" className="flex-1"><Trash2 className="w-4 h-4 mr-2"/>Discard Item</Button>
                         </div>
                    </div>
                </div>
            </div>
        </>);
};
// --- MAIN GODOWN PAGE COMPONENT ---
export default function GodownPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [clientDate, setClientDate] = useState("");
    useEffect(() => {
        setClientDate(new Date("2025-08-05T23:00:03").toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);
    const kpiData = useMemo(() => ({
        totalValue: godownItems.reduce((acc, item) => acc + item.value, 0),
        criticalItems: godownItems.filter(item => item.risk === 'critical' || getExpiryInfo(item.expiry).isUrgent).length,
        capacity: 72, avgFreshness: Math.round(godownItems.reduce((acc, item) => acc + item.freshness, 0) / godownItems.length)
    }), []);
    const { criticalItems, watchlistItems, fullInventory } = useMemo(() => {
        const allItems = godownItems;
        const critical = allItems.filter(i => i.risk === 'critical' || getExpiryInfo(i.expiry).text.includes('Expired'));
        const watchlist = allItems.filter(i => !critical.includes(i) && getExpiryInfo(i.expiry).isUrgent);
        const full = allItems.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return { criticalItems: critical, watchlistItems: watchlist, fullInventory: full };
    }, [searchTerm]);
    return (<div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <div className="absolute inset-0 h-full w-full bg-no-repeat bg-bottom opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230071ce'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
      
      <main className="p-4 md:p-8 relative z-10 max-w-7xl mx-auto">
        <header className="border-b border-slate-200 pb-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors mb-2"><ArrowLeft className="w-4 h-4"/><span className="text-sm font-medium">Back</span></button>
              <h1 className="text-4xl font-bold text-slate-800">Godown <span className="text-blue-600">Command Center</span></h1>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <KpiCard title="Total Inventory Value" value={<AnimatedNumber value={kpiData.totalValue} isCurrency={true}/>}>
                <div className="text-xs text-green-600 flex items-center mt-1"><TrendingUp className="w-4 h-4 mr-1"/>+2.5% vs last month</div>
              </KpiCard>
              <KpiCard title="Items Requiring Action" value={<AnimatedNumber value={kpiData.criticalItems}/>} unit=" Items">
                 <div className="w-full bg-red-100 rounded-full h-1.5 mt-2"><div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(kpiData.criticalItems / godownItems.length) * 100}%` }}></div></div>
              </KpiCard>
              <KpiCard title="Capacity Utilization" value={<AnimatedNumber value={kpiData.capacity}/>} unit="%">
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2"><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${kpiData.capacity}%` }}></div></div>
              </KpiCard>
              <KpiCard title="Average Freshness" value={<AnimatedNumber value={kpiData.avgFreshness}/>} unit="%">
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${kpiData.avgFreshness}%` }}></div></div>
              </KpiCard>
          </div>
        </header>
        
        {/* UPDATED: Side-by-side layout for action sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <section>
                <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-6 h-6 text-red-500"/><h2 className="text-2xl font-bold text-slate-800">Immediate Action</h2></div>
                <div className="space-y-4">
                    {criticalItems.map((item, index) => (<Card key={item.id} className="bg-white border-l-4 border-red-500 shadow-md flex flex-col transition-transform hover:-translate-y-1" style={{ animation: `fadeInUp 0.5s ease-out ${index * 80}ms both` }}>
                            <CardHeader className="pb-2"><CardTitle className="text-lg">{item.name}</CardTitle><CardDescription>{item.status}</CardDescription></CardHeader>
                            <CardContent className="flex-grow grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400"/><span>{item.zone}</span></div>
                                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-slate-400"/><span>₹{item.value.toLocaleString('en-IN')}</span></div>
                                <div className="flex items-center gap-2"><Package className="w-4 h-4 text-slate-400"/><span>{item.quantity}</span></div>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-400"/><span className={getExpiryInfo(item.expiry).color}>{getExpiryInfo(item.expiry).text}</span></div>
                            </CardContent>
                            <div className="p-4 pt-2"><Button onClick={() => setSelectedItem(item)} size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white"><MoveRight className="w-4 h-4 mr-2"/>View Details & Actions</Button></div>
                        </Card>))}
                </div>
            </section>
            <section>
                <div className="flex items-center gap-3 mb-4"><Clock className="w-6 h-6 text-yellow-500"/><h2 className="text-2xl font-bold text-slate-800">Expiry Watchlist</h2></div>
                <div className="space-y-4">
                    {watchlistItems.map((item, index) => (<Card key={item.id} onClick={() => setSelectedItem(item)} className="bg-white border-l-4 border-yellow-500 shadow-md p-4 flex items-center gap-4 transition-transform hover:-translate-y-1 cursor-pointer" style={{ animation: `fadeInUp 0.5s ease-out ${index * 80}ms both` }}>
                            <div className="flex-shrink-0 text-center"><p className="text-3xl font-bold text-yellow-600">{getExpiryInfo(item.expiry).days}</p><p className="text-xs text-slate-500">days left</p></div>
                            <div className="border-l h-12 border-slate-200"></div>
                            <div className="flex-1"><h3 className="font-semibold">{item.name}</h3><p className="text-xs text-slate-500">{item.zone} • ₹{item.value.toLocaleString('en-IN')}</p></div>
                        </Card>))}
                </div>
            </section>
        </div>

        <section className="mb-12">
            <Card className="bg-white border-l-4 border-blue-500 shadow-md transition-transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <List className="w-6 h-6 text-slate-700"/>
                            <CardTitle className="text-2xl font-bold text-slate-800">Full Godown Inventory</CardTitle>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
                            <Input placeholder={`Search ${fullInventory.length} items...`} className="pl-12 text-base h-11 shadow-sm bg-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="bg-white shadow-md overflow-hidden border border-slate-200/60">
                        <div className="grid grid-cols-12 p-4 text-xs font-semibold text-slate-500 bg-slate-100 uppercase tracking-wider">
                            <div className="col-span-4">Product Name</div><div className="col-span-2">Location</div><div className="col-span-2">Expiry</div>
                            <div className="col-span-1 text-center">Freshness</div><div className="col-span-1 text-right">Value (₹)</div><div className="col-span-2 text-center">Status</div>
                        </div>
                        <div className="divide-y divide-slate-200/60 max-h-[50vh] overflow-y-auto">
                            {fullInventory.map(item => (<div key={item.id} onClick={() => setSelectedItem(item)} className="grid grid-cols-12 p-4 items-center hover:bg-blue-50/50 transition-all duration-200 cursor-pointer hover:shadow-inner">
                                    <div className="col-span-4 font-semibold text-blue-900">{item.name}</div>
                                    <div className="col-span-2 text-sm text-slate-600">{item.zone}</div>
                                    <div className={cn("col-span-2 text-sm font-medium", getExpiryInfo(item.expiry).color)}>{getExpiryInfo(item.expiry).text}</div>
                                    <div className="col-span-1 text-center font-semibold text-slate-800">{item.freshness}%</div>
                                    <div className="col-span-1 text-right font-medium text-slate-800">{item.value.toLocaleString('en-IN')}</div>
                                    <div className="col-span-2 flex justify-center"><Badge variant={item.status === 'Optimal' ? 'default' : 'secondary'} className={cn(item.status === 'Optimal' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800")}>{item.status}</Badge></div>
                                </div>))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
      </main>

      <ItemDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)}/>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>);
}

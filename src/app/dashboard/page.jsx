"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Star, MapPin, Thermometer, Clock, BarChart3, AlertTriangle, CheckCircle, Truck, Tag, Package, TrendingUp, DollarSign, Activity, Zap, } from "lucide-react";
import { ProductDetailPanel } from "@/components/product-detail-panel";
import { useNavigate } from "react-router-dom";
export default function StoreDashboard() {
  const [selectedStore, setSelectedStore] = useState("store-001");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({
    categories: false,
    products: false,
    quickActions: false,
  });
  const navigate = useNavigate();
  const stores = [
    { id: "store-003", name: "Walmart Supercenter - Aurangabad, IN #001", pinned: true },
    { id: "store-005", name: "Walmart Supercenter - Thane, IN #003", pinned: true },
    { id: "store-002", name: "Walmart Supercenter - Amravati, IN #002", pinned: true },
    { id: "store-001", name: "Walmart Supercenter - Mumbai, IN #004", pinned: false },
    { id: "store-004", name: "Walmart Supercenter - Nagpur, IN #005", pinned: false },
    { id: "store-006", name: "Walmart Supercenter - Pune, IN #006", pinned: false },
    { id: "store-007", name: "Walmart Supercenter - Thane-Bhiwandi-Ulhasnagar, IN #007", pinned: false },
    { id: "store-008", name: "Walmart Supercenter - Greater Mumbai, IN #008", pinned: false },
    { id: "store-009", name: "Walmart Supercenter - Vasai-Virar-Mira-Bhayanadar, IN #009", pinned: false },
    { id: "store-010", name: "Walmart Supercenter - Thane (Kalyan-Dombivli), IN #010", pinned: false },
    { id: "store-011", name: "Walmart Supercenter - Thane (Navi Mumbai), IN #011", pinned: false },
  ];
  const recentProducts = [
    {
      id: "prod-001",
      name: "Organic Spinach",
      category: "vegetables",
      freshness: 85,
      location: "Aisle 12A - Cooler 3",
      shelf: "C3-A12",
      temperature: "35°F",
      shelfLife: "3 days",
      risk: "low",
      image: "/spinach.webp?height=80&width=80",
      price: "₹349",
      quantity: "20 kg",
      batch: "VEG001-A",
      supplier: "Green Valley Farms",
      receivedDate: "2025-01-15",
      expiryDate: "2025-01-18",
    },
    {
      id: "prod-002",
      name: "Atlantic Salmon",
      category: "seafood",
      freshness: 72,
      location: "Seafood Counter",
      shelf: "SC-01",
      temperature: "32°F",
      shelfLife: "1 day",
      risk: "medium",
      image: "/placeholder.svg?height=80&width=80",
      price: "₹1,149",
      quantity: "5 kg",
      batch: "SAL001-A",
      supplier: "Ocean Fresh",
      receivedDate: "2025-01-15",
      expiryDate: "2025-01-16",
    },
    {
      id: "prod-003",
      name: "Artisan Bread",
      category: "bakery",
      freshness: 45,
      location: "Bakery Section",
      shelf: "BK-01",
      temperature: "68°F",
      shelfLife: "6 hours",
      risk: "critical",
      image: "/bread.jpeg?height=80&width=80",
      price: "₹499",
      quantity: "8 loaves",
      batch: "BRD001-A",
      supplier: "In-Store Bakery",
      receivedDate: "2025-01-15",
      expiryDate: "2025-01-15",
    },
    {
      id: "prod-004",
      name: "Roma Tomatoes",
      category: "vegetables",
      freshness: 78,
      location: "Aisle 12B - Display",
      shelf: "D1-A12B",
      temperature: "38°F",
      shelfLife: "4 days",
      risk: "low",
      image: "/tomato.webp?height=80&width=80",
      price: "₹249",
      quantity: "30 kg",
      batch: "TOM002-A",
      supplier: "Sunshine Produce",
      receivedDate: "2025-01-15",
      expiryDate: "2025-01-19",
    },
    {
      id: "prod-005",
      name: "Whole Milk",
      category: "dairy",
      freshness: 92,
      location: "Dairy Section - Cooler A",
      shelf: "DA-01",
      temperature: "38°F",
      shelfLife: "5 days",
      risk: "low",
      image: "/placeholder.svg?height=80&width=80",
      price: "₹299",
      quantity: "24 gallons",
      batch: "MLK001-A",
      supplier: "Prairie Farms",
      receivedDate: "2025-01-15",
      expiryDate: "2025-01-20",
    },
  ];
  const categories = [
    {
      id: "vegetables",
      name: "Vegetables",
      score: 85,
      risk: "low",
      items: 156,
      color: "bg-green-500",
      image: "/walmart_veggies.webp?height=120&width=120",
      totalValue: "₹8,96,450",
      criticalItems: 3,
    },
    {
      id: "seafood",
      name: "Seafood",
      score: 72,
      risk: "medium",
      items: 43,
      color: "bg-blue-500",
      image: "/walmart_seafood.jpg?height=120&width=120",
      totalValue: "₹6,42,320",
      criticalItems: 8,
    },
    {
      id: "dairy",
      name: "Dairy",
      score: 91,
      risk: "low",
      items: 89,
      color: "bg-yellow-500",
      image: "/walmart_dairy.webp?height=120&width=120",
      totalValue: "₹4,88,180",
      criticalItems: 1,
    },
    {
      id: "bakery",
      name: "Bakery",
      score: 68,
      risk: "critical",
      items: 67,
      color: "bg-orange-500",
      image: "/walmart_bakery.jpg?height=120&width=120",
      totalValue: "₹2,33,240",
      criticalItems: 15,
    },
    {
      id: "meat",
      name: "Meat",
      score: 79,
      risk: "medium",
      items: 78,
      color: "bg-red-500",
      image: "/walmart_meat.jpg?height=120&width=120",
      totalValue: "₹11,29,680",
      criticalItems: 5,
    },
    {
      id: "packaged",
      name: "Packaged Food",
      score: 94,
      risk: "low",
      items: 234,
      color: "bg-purple-500",
      image: "/walmart_pkgfood.webp?height=120&width=120",
      totalValue: "₹6,72,340",
      criticalItems: 0,
    },
  ];
  // Replace static data with per-store mock data
  const storeData = {
    "store-001": {
      metrics: {
        totalItems: 1247,
        avgFreshness: 84,
        criticalItems: 32,
        totalValue: 56400,
      },
      recentProducts: [...recentProducts], // use the original array for now
      categories: [...categories], // use the original array for now
    },
    "store-002": {
      metrics: {
        totalItems: 980,
        avgFreshness: 79,
        criticalItems: 18,
        totalValue: 43200,
      },
      recentProducts: [...recentProducts.slice(0, 3)],
      categories: [...categories.map(c => ({ ...c, score: c.score - 5 }))],
    },
    "store-003": {
      metrics: {
        totalItems: 1560,
        avgFreshness: 88,
        criticalItems: 12,
        totalValue: 67800,
      },
      recentProducts: [...recentProducts.slice(2)],
      categories: [...categories.map(c => ({ ...c, score: c.score + 3 }))],
    },
  };
  const currentStore = storeData[selectedStore];
  // Add analytics data for overview
  const analyticsData = {
    freshnessTrend: [
      { time: "6 AM", value: 92 },
      { time: "9 AM", value: 89 },
      { time: "12 PM", value: 86 },
      { time: "3 PM", value: 84 },
      { time: "6 PM", value: 82 },
      { time: "Now", value: 84 },
    ],
    topCategories: [
      { name: "Vegetables", value: 85, change: "+2.3%" },
      { name: "Dairy", value: 91, change: "+1.8%" },
      { name: "Seafood", value: 72, change: "-0.5%" },
      { name: "Bakery", value: 68, change: "-2.1%" },
    ],
    recentAlerts: [
      { type: "temperature", message: "Cooler 3 temperature rising", time: "2 min ago", severity: "medium" },
      { type: "expiry", message: "5 items expiring in 2 hours", time: "5 min ago", severity: "high" },
      { type: "stock", message: "Milk stock below threshold", time: "8 min ago", severity: "low" },
    ]
  };
  const getRiskColor = (risk) => {
    switch (risk) {
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const getRiskIcon = (risk) => {
    switch (risk) {
      case "low":
        return <CheckCircle className="w-4 h-4" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  return (<div className="min-h-screen bg-gray-50">
    <div className="p-6 max-w-7xl mx-auto">
      {/* Walmart Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Dashboard</h1>
            <div className="flex items-center space-x-2 mt-3">
              <Badge className="bg-[#0071ce] text-white border-[#0071ce]">
                <Activity className="w-3 h-3 mr-1" />
                Live Monitoring
              </Badge>
              <Badge className="bg-[#ffc220] text-gray-900 border-[#ffc220]">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-gray-500">Last Updated</div>
              <div className="text-sm font-medium text-[#0071ce]">2 min ago</div>
            </div>
            <div className="w-3 h-3 bg-[#ffc220] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Store Selector - Walmart Theme */}
      <Card className="mb-6 bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce]">
        <CardContent className="p-6 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#0071ce] rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="border-[#0071ce]/20 focus:border-[#0071ce] focus:ring-[#0071ce]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (<SelectItem key={store.id} value={store.id}>
                    <div className="flex items-center">
                      {store.pinned && <Star className="w-4 h-4 mr-2 text-[#ffc220]" />}
                      {store.name}
                    </div>
                  </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/5">
              <Star className="w-4 h-4 mr-2" />
              Pin Store
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg p-1 shadow-sm mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
            <Package className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Critical Products
          </TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
            <Zap className="w-4 h-4 mr-2" />
            Quick Actions
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Key Metrics Cards - Walmart Theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-[#0071ce]/10 to-[#0071ce]/5 border-0 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#0071ce]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0071ce] mb-1">Total Items</p>
                    <p className="text-3xl font-bold text-gray-900">{currentStore.metrics.totalItems.toLocaleString()}</p>
                    <p className="text-xs text-[#0071ce] mt-2 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12 from yesterday
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-[#0071ce] rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#ffc220]/10 to-[#ffc220]/5 border-0 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#ffc220]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#ffc220] mb-1">Avg Freshness</p>
                    <p className="text-3xl font-bold text-gray-900">{currentStore.metrics.avgFreshness}%</p>
                    <p className="text-xs text-[#ffc220] mt-2 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +2% from yesterday
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-[#ffc220] rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">Critical Items</p>
                    <p className="text-3xl font-bold text-gray-900">{currentStore.metrics.criticalItems}</p>
                    <p className="text-xs text-red-600 mt-2 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      -5 from yesterday
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Total Value</p>
                    <p className="text-3xl font-bold text-gray-900">₹{currentStore.metrics.totalValue.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-2 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8% from yesterday
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modern Analytics Section - Walmart Theme */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Freshness Trend Chart */}
            <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce]">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                <CardTitle className="text-xl flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-[#0071ce]" />
                  Freshness Trend (24h)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current: {currentStore.metrics.avgFreshness}%</span>
                    <span className="text-sm text-[#0071ce] font-medium">+2.3% vs yesterday</span>
                  </div>
                  <div className="relative h-40 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[0, 25, 50, 75, 100].map((line) => (<div key={line} className="border-t border-gray-200"></div>))}
                    </div>
                    {/* Chart bars */}
                    <div className="relative h-full flex items-end space-x-3">
                      {analyticsData.freshnessTrend.map((point, index) => (<div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gradient-to-t from-[#0071ce] to-[#0071ce]/70 rounded-t transition-all duration-300 hover:from-[#0071ce] hover:to-[#0071ce]/90 hover:shadow-lg min-h-[8px] relative group" style={{ height: `${Math.max((point.value / 100) * 100, 8)}px` }}>
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {point.value}%
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 mt-2 font-medium">{point.time}</span>
                      </div>))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Categories Performance */}
            <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#ffc220]">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#ffc220]/5 to-transparent">
                <CardTitle className="text-xl flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-[#ffc220]" />
                  Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {analyticsData.topCategories.map((category, index) => (<div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-[#0071ce]' : index === 1 ? 'bg-[#ffc220]' : index === 2 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{category.value}%</div>
                      <div className={`text-xs font-medium ${category.change.startsWith('+') ? 'text-[#0071ce]' : 'text-red-600'}`}>
                        {category.change}
                      </div>
                    </div>
                  </div>))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Alerts Section - Walmart Theme */}
          <Card className="bg-white border-0 shadow-lg border-l-4 border-l-red-500">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-red-50 to-transparent">
              <CardTitle className="text-xl flex items-center justify-between">
                <span className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Live Alerts
                </span>
                <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">
                  {analyticsData.recentAlerts.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {analyticsData.recentAlerts.map((alert, index) => (<div key={index} className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${alert.severity === 'high' ? 'bg-red-50 border-red-200 hover:bg-red-100' :
                  alert.severity === 'medium' ? 'bg-[#ffc220]/10 border-[#ffc220]/30 hover:bg-[#ffc220]/20' :
                    'bg-[#0071ce]/10 border-[#0071ce]/30 hover:bg-[#0071ce]/20'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-[#ffc220]' :
                        'bg-[#0071ce]'}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">{alert.time}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className={`border ${alert.severity === 'high' ? 'border-red-300 text-red-700 hover:bg-red-50' :
                    alert.severity === 'medium' ? 'border-[#ffc220] text-[#ffc220] hover:bg-[#ffc220]/10' :
                      'border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/10'}`}>
                    View
                  </Button>
                </div>))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab - Walmart Theme */}
        <TabsContent value="categories" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce]">
            <CardContent className="p-6 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0071ce] w-5 h-5" />
                  <Input placeholder="Search categories..." className="pl-12 h-12 border-[#0071ce]/20 focus:border-[#0071ce] focus:ring-[#0071ce]/20 text-base" />
                </div>
                <Button variant="outline" className="border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/5 h-12 px-6">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories Grid - Walmart Theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentStore.categories.map((category) => (<Card key={category.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-0 shadow-lg group border-l-4 border-l-[#0071ce] hover:border-l-[#ffc220]" onClick={() => navigate(`/dashboard/category/${category.id}`)}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img src={category.image || "/placeholder.svg"} alt={category.name} className="w-16 h-16 rounded-xl object-cover shadow-md" />
                    <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${category.color}`}></div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 group-hover:text-[#0071ce] transition-colors font-bold">
                      {category.name}
                    </CardTitle>
                    <Badge className={`${getRiskColor(category.risk)} border mt-2 font-medium`}>
                      {getRiskIcon(category.risk)}
                      <span className="ml-1">{category.risk}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Freshness</span>
                    <span className="font-bold text-2xl text-gray-900">{category.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`h-3 rounded-full bg-gradient-to-r from-[#0071ce] to-[#0071ce]/80 transition-all duration-500`} style={{ width: `${category.score}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-[#0071ce]/5 rounded-lg border border-[#0071ce]/10">
                      <div className="font-bold text-gray-900 text-lg">{category.items}</div>
                      <div className="text-gray-600 text-sm">Items</div>
                    </div>
                    <div className="text-center p-3 bg-[#ffc220]/5 rounded-lg border border-[#ffc220]/10">
                      <div className="font-bold text-gray-900 text-lg">{category.totalValue}</div>
                      <div className="text-gray-600 text-sm">Value</div>
                    </div>
                  </div>
                  {category.criticalItems > 0 && (<div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-sm font-medium text-red-700">Critical Items</span>
                    <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">{category.criticalItems}</Badge>
                  </div>)}
                </div>
              </CardContent>
            </Card>))}
          </div>
        </TabsContent>

        {/* Critical Products Tab - Walmart Theme */}
        <TabsContent value="products" className="space-y-8">
          {/* Search and Filters */}
          <Card className="bg-white border-0 shadow-lg border-l-4 border-l-red-500">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-red-50 to-transparent">
              <CardTitle className="text-xl flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Critical Products Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                  <Input placeholder="Search critical products..." className="pl-12 h-12 text-base border-red-200 focus:border-red-500 focus:ring-red-500/20" />
                </div>
                <Select>
                  <SelectTrigger className="w-48 h-12 border-red-200 focus:border-red-500 focus:ring-red-500/20">
                    <SelectValue placeholder="Sort by urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expiry">Expiry Time</SelectItem>
                    <SelectItem value="freshness">Freshness Score</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 h-12 px-6">
                  <Filter className="w-5 h-5 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>

            {/* Critical Products List - Walmart Theme */}
            <CardContent className="p-6">
              <div className="space-y-4">
                {currentStore.recentProducts
                  .filter((product) => product.risk === "critical")
                  .map((product) => (<div key={product.id} className="flex items-center space-x-6 p-6 bg-gradient-to-r from-red-50 to-red-25 rounded-xl border border-red-200 hover:bg-red-100 transition-all duration-300 hover:shadow-md">
                    <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-24 h-24 rounded-xl object-cover shadow-md" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 text-2xl">{product.name}</h3>
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mt-3">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-[#0071ce]" />
                              {product.location}
                            </span>
                            <span className="flex items-center">
                              <Package className="w-4 h-4 mr-2 text-[#0071ce]" />
                              {product.quantity}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-red-500" />
                              {product.shelfLife}
                            </span>
                            <span className="flex items-center">
                              <Thermometer className="w-4 h-4 mr-2 text-red-500" />
                              {product.temperature}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            Batch: {product.batch} • Supplier: {product.supplier}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-5xl text-red-600">{product.freshness}%</div>
                          <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">{product.risk}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <Button size="sm" className="bg-[#0071ce] hover:bg-[#0071ce]/90 text-white px-6 font-medium" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}>
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#ffc220] text-[#ffc220] hover:bg-[#ffc220]/10">
                        <Truck className="w-4 h-4 mr-2" />
                        Transfer
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                        <Tag className="w-4 h-4 mr-2" />
                        Flash Sale
                      </Button>
                    </div>
                  </div>))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Actions Tab - Modern Theme */}
        <TabsContent value="actions" className="space-y-8">
          <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce]">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
              <CardTitle className="text-xl flex items-center">
                <Zap className="w-5 h-5 mr-2 text-[#0071ce]" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logistics Card */}
                <div className="relative h-48 rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => navigate("/logistics")}>
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('/logistics.jpg')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/20 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                        <Truck className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Logistics</h3>
                      <p className="text-white/80 text-sm">Fleet Management</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-[#0071ce] rounded-full opacity-80"></div>
                </div>

                {/* Analytics Card */}
                <div className="relative h-48 rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => navigate("/dashboard/analytics")}>
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('/analytics.jpg')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/20 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Analytics</h3>
                      <p className="text-white/80 text-sm">Performance Insights</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-[#ffc220] rounded-full opacity-80"></div>
                </div>

                {/* Godown/Storage Card */}
                <div className="relative h-48 rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => navigate("/dashboard/godown")}>
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('/godown.jpeg')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/20 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                        <Package className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Godown</h3>
                      <p className="text-white/80 text-sm">Inventory Management</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full opacity-80"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    {/* Product Detail Panel */}
    {selectedProduct && <ProductDetailPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
  </div>);
}

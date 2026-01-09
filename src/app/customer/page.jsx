import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Package, Store, MapPin, BarChart3, Plus, Edit, Trash2, Eye, QrCode, Star, Brain, Zap, CheckCircle, XCircle, FileText, Download, Code, Database, Smartphone, Calendar, Target, RefreshCw, Settings, Search, BarChart, Activity, TrendingUp as TrendingUpIcon, MessageSquare, Lightbulb, Rocket, Timer, Copy, Grid3X3, List, Columns, } from "lucide-react";
export default function CustomerPage() {
  const navigate = useNavigate();
  const [selectedSale, setSelectedSale] = useState(null);
  const [showBarcode, setShowBarcode] = useState(false);
  const [showFreshnessReport, setShowFreshnessReport] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  // Search and filter states for Live Flash Sales
  const [salesSearchTerm, setSalesSearchTerm] = useState("");
  const [salesStatusFilter, setSalesStatusFilter] = useState("all");
  const [salesPerformanceFilter, setSalesPerformanceFilter] = useState("all");
  const [salesChannelFilter, setSalesChannelFilter] = useState("all");
  const [salesRegionFilter, setSalesRegionFilter] = useState("all");
  const [salesViewFormat, setSalesViewFormat] = useState("grid"); // grid, list, compact
  // Search and filter states for Vendor Requests
  const [vendorSearchTerm, setVendorSearchTerm] = useState("");
  const [vendorStatusFilter, setVendorStatusFilter] = useState("all");
  const [vendorQualityFilter, setVendorQualityFilter] = useState("all");
  const [vendorViewFormat, setVendorViewFormat] = useState("grid"); // grid, list, compact
  const handleSignOut = () => {
    navigate("/");
  };
  // Live Flash Sales Data
  const liveFlashSales = [
    {
      id: "fs-001",
      product: "Organic Spinach",
      originalPrice: 414,
      salePrice: 248,
      discount: 40,
      timeLeft: "2h 15m",
      freshness: 78,
      quantityLeft: 45,
      totalQuantity: 100,
      channel: "online",
      region: "Mumbai Metro",
      performance: "excellent",
      revenue: 11187,
      status: "active",
      store: "Walmart Supercenter #1234",
      storeAddress: "123 MG Road, Mumbai, MH 400001",
      appUsers: 1250,
      rating: 4.8,
      reviews: 156,
      barcode: "1234567890123",
      freshnessReport: {
        harvestedDate: "2025-01-15",
        expiryDate: "2025-01-20",
        temperature: "2.5°C",
        humidity: "85%",
        quality: "Excellent",
        recommendations: ["Consume within 2 days", "Store at 2-4°C"]
      }
    },
    {
      id: "fs-002",
      product: "Atlantic Salmon",
      originalPrice: 1328,
      salePrice: 829,
      discount: 37,
      timeLeft: "45m",
      freshness: 65,
      quantityLeft: 8,
      totalQuantity: 25,
      channel: "in-store",
      region: "Pune Supercenter",
      performance: "good",
      revenue: 16593,
      status: "active",
      store: "Walmart Supercenter #5678",
      storeAddress: "456 FC Road, Pune, MH 411005",
      appUsers: 890,
      rating: 4.6,
      reviews: 89,
      barcode: "9876543210987",
      freshnessReport: {
        harvestedDate: "2025-01-14",
        expiryDate: "2025-01-18",
        temperature: "1.8°C",
        humidity: "90%",
        quality: "Good",
        recommendations: ["Consume within 1 day", "Keep refrigerated"]
      }
    },
    {
      id: "fs-003",
      product: "Artisan Bread",
      originalPrice: 580,
      salePrice: 290,
      discount: 50,
      timeLeft: "Ended",
      freshness: 0,
      quantityLeft: 0,
      totalQuantity: 30,
      channel: "both",
      region: "Thane Metro",
      performance: "excellent",
      revenue: 8700,
      status: "sold-out",
      store: "Walmart Supercenter #9012",
      storeAddress: "789 Eastern Express Highway, Thane, MH 400601",
      appUsers: 2100,
      rating: 4.9,
      reviews: 234,
      barcode: "4567891230456",
      freshnessReport: {
        harvestedDate: "2025-01-13",
        expiryDate: "2025-01-16",
        temperature: "3.2°C",
        humidity: "75%",
        quality: "Expired",
        recommendations: ["Product expired", "Remove from inventory"]
      }
    },
  ];
  // AI Suggestions Data
  const aiSuggestionsData = [
    {
      id: "ai-001",
      type: "pricing",
      suggestion: "Increase discount to 45% for faster clearance",
      confidence: 92,
      impact: "High",
      reasoning: "Similar products sold 30% faster with 45% discount"
    },
    {
      id: "ai-002",
      type: "timing",
      suggestion: "Extend sale duration by 2 hours",
      confidence: 87,
      impact: "Medium",
      reasoning: "Peak customer activity expected in next 2 hours"
    },
    {
      id: "ai-003",
      type: "inventory",
      suggestion: "Transfer 10 units to Mumbai store",
      confidence: 95,
      impact: "High",
      reasoning: "Mumbai store has 3x higher demand for this product"
    },
    {
      id: "ai-004",
      type: "marketing",
      suggestion: "Send push notification to 500 nearby customers",
      confidence: 89,
      impact: "Medium",
      reasoning: "Customers within 5-mile radius show high interest"
    }
  ];
  // Vendor Requests Data
  const vendorRequests = [
    {
      id: "vr-001",
      vendor: "Fresh Farms Co.",
      product: "Organic Tomatoes",
      quantity: 227,
      proposedPrice: 207,
      originalPrice: 331,
      discount: 37,
      expiryDate: "2025-01-25",
      status: "pending",
      submittedDate: "2025-01-15",
      vendorRating: 4.7,
      vendorHistory: "5 previous successful sales",
      qualityScore: 92,
      wasteReduction: "85%",
      aiRecommendation: "Approve with 15% additional discount",
      aiConfidence: 94
    },
    {
      id: "vr-002",
      vendor: "Dairy Delights",
      product: "Greek Yogurt",
      quantity: 300,
      proposedPrice: 165,
      originalPrice: 373,
      discount: 56,
      expiryDate: "2025-01-22",
      status: "approved",
      submittedDate: "2025-01-14",
      vendorRating: 4.9,
      vendorHistory: "12 previous successful sales",
      qualityScore: 96,
      wasteReduction: "90%",
      aiRecommendation: "Approve as proposed",
      aiConfidence: 98
    },
    {
      id: "vr-003",
      vendor: "Bakery Express",
      product: "Sourdough Bread",
      quantity: 200,
      proposedPrice: 1.79,
      originalPrice: 3.99,
      discount: 55,
      expiryDate: "2025-01-20",
      status: "rejected",
      submittedDate: "2025-01-13",
      vendorRating: 3.8,
      vendorHistory: "2 previous successful sales",
      qualityScore: 78,
      wasteReduction: "70%",
      aiRecommendation: "Reject - quality concerns",
      aiConfidence: 91
    },
  ];
  // Filter functions for Live Flash Sales
  const filteredLiveFlashSales = liveFlashSales.filter((sale) => {
    const matchesSearch = sale.product.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
      sale.store.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
      sale.storeAddress.toLowerCase().includes(salesSearchTerm.toLowerCase());
    const matchesStatus = salesStatusFilter === "all" || sale.status === salesStatusFilter;
    const matchesPerformance = salesPerformanceFilter === "all" || sale.performance === salesPerformanceFilter;
    const matchesChannel = salesChannelFilter === "all" || sale.channel === salesChannelFilter;
    const matchesRegion = salesRegionFilter === "all" || sale.region === salesRegionFilter;
    return matchesSearch && matchesStatus && matchesPerformance && matchesChannel && matchesRegion;
  });
  // Filter functions for Vendor Requests
  const filteredVendorRequests = vendorRequests.filter((request) => {
    const matchesSearch = request.product.toLowerCase().includes(vendorSearchTerm.toLowerCase()) ||
      request.vendor.toLowerCase().includes(vendorSearchTerm.toLowerCase());
    const matchesStatus = vendorStatusFilter === "all" || request.status === vendorStatusFilter;
    const matchesQuality = vendorQualityFilter === "all" ||
      (vendorQualityFilter === "high" && request.qualityScore >= 90) ||
      (vendorQualityFilter === "medium" && request.qualityScore >= 80 && request.qualityScore < 90) ||
      (vendorQualityFilter === "low" && request.qualityScore < 80);
    return matchesSearch && matchesStatus && matchesQuality;
  });
  // Clear filters functions
  const clearSalesFilters = () => {
    setSalesSearchTerm("");
    setSalesStatusFilter("all");
    setSalesPerformanceFilter("all");
    setSalesChannelFilter("all");
    setSalesRegionFilter("all");
  };
  const clearVendorFilters = () => {
    setVendorSearchTerm("");
    setVendorStatusFilter("all");
    setVendorQualityFilter("all");
  };
  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "excellent":
        return "text-green-600 bg-green-50";
      case "good":
        return "text-blue-600 bg-blue-50";
      case "poor":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "sold-out":
        return "text-gray-600 bg-gray-50";
      case "expired":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "approved":
        return "text-green-600 bg-green-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };
  const handleEditSale = (sale) => {
    setEditingSale(sale);
  };
  const handleDeleteSale = (saleId) => {
    // Implementation for deleting sale
    console.log("Deleting sale:", saleId);
  };
  const handleViewBarcode = (barcode) => {
    setShowBarcode(true);
    // Implementation for barcode viewer
  };
  const handleViewFreshnessReport = (report) => {
    setShowFreshnessReport(true);
    // Implementation for freshness report
  };
  return (<div className="min-h-screen bg-gray-50">
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flash Sales Management</h1>
          <div className="flex items-center space-x-2 mt-3">
            <div className="w-3 h-3 bg-[#ffc220] rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live System</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/5">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="live-sales" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white rounded-lg p-1 shadow-sm">
          <TabsTrigger value="live-sales" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
            <Zap className="w-4 h-4 mr-2" />
            Live Flash Sales
          </TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
            <Settings className="w-4 h-4 mr-2" />
            Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics & API
          </TabsTrigger>
          <TabsTrigger value="vendor-requests" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
            <Package className="w-4 h-4 mr-2" />
            Vendor Requests
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        {/* Live Flash Sales Tab */}
        <TabsContent value="live-sales" className="mt-6">
          {/* Search and Filters Card */}
          <Card className="mb-6 border-l-4 border-l-[#0071ce]">
            <CardHeader className="pb-4 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
              <CardTitle className="flex items-center text-lg">
                <Search className="w-5 h-5 mr-2 text-[#0071ce]" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search sales by product name, store, or region..." value={salesSearchTerm} onChange={(e) => setSalesSearchTerm(e.target.value)} className="pl-10 border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20" />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                  <Select value={salesStatusFilter} onValueChange={setSalesStatusFilter}>
                    <SelectTrigger className="border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="sold-out">Sold Out</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Performance</label>
                  <Select value={salesPerformanceFilter} onValueChange={setSalesPerformanceFilter}>
                    <SelectTrigger className="border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20">
                      <SelectValue placeholder="All Performance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Performance</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Channel</label>
                  <Select value={salesChannelFilter} onValueChange={setSalesChannelFilter}>
                    <SelectTrigger className="border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20">
                      <SelectValue placeholder="All Channels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="online">Online Only</SelectItem>
                      <SelectItem value="in-store">In-Store Only</SelectItem>
                      <SelectItem value="both">Both Channels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Region</label>
                  <Select value={salesRegionFilter} onValueChange={setSalesRegionFilter}>
                    <SelectTrigger className="border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20">
                      <SelectValue placeholder="All Regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="Mumbai Metro">Mumbai Metro</SelectItem>
                      <SelectItem value="Pune Supercenter">Pune Supercenter</SelectItem>
                      <SelectItem value="Thane Metro">Thane Metro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  {filteredLiveFlashSales.length} sales found
                </div>
                <Button variant="outline" size="sm" onClick={clearSalesFilters} className="border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/5">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* View Format Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">View Format:</span>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button variant="ghost" size="sm" onClick={() => setSalesViewFormat("grid")} className={`h-8 px-3 ${salesViewFormat === "grid"
                  ? "bg-white text-[#0071ce] shadow-sm"
                  : "text-gray-600 hover:text-[#0071ce]"}`}>
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSalesViewFormat("list")} className={`h-8 px-3 ${salesViewFormat === "list"
                  ? "bg-white text-[#0071ce] shadow-sm"
                  : "text-gray-600 hover:text-[#0071ce]"}`}>
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSalesViewFormat("compact")} className={`h-8 px-3 ${salesViewFormat === "compact"
                  ? "bg-white text-[#0071ce] shadow-sm"
                  : "text-gray-600 hover:text-[#0071ce]"}`}>
                  <Columns className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sales Content based on view format */}
          {filteredLiveFlashSales.length === 0 ? (<div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No flash sales found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search terms or filters</p>
            <Button variant="outline" onClick={clearSalesFilters} className="border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/5">
              Clear all filters
            </Button>
          </div>) : (<>
            {salesViewFormat === "grid" && (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLiveFlashSales.map((sale) => (<Card key={sale.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-[#0071ce]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{sale.product}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getStatusColor(sale.status)}>{sale.status}</Badge>
                        <Badge className={getPerformanceColor(sale.performance)}>{sale.performance}</Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{sale.rating}</span>
                          <span className="text-sm text-gray-500">({sale.reviews})</span>
                        </div>
                      </div>
                    </div>
                    {sale.status === "sold-out" && (<Badge variant="destructive" className="text-xs">
                      SOLD OUT
                    </Badge>)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-green-600">₹{sale.salePrice}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">₹{sale.originalPrice}</span>
                      <Badge variant="destructive" className="ml-2 text-xs">
                        -{sale.discount}%
                      </Badge>
                    </div>
                    {sale.status === "active" && (<div className="flex items-center text-sm text-red-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {sale.timeLeft}
                    </div>)}
                  </div>

                  {/* Store Information */}
                  <div className="bg-[#0071ce]/5 p-3 rounded-lg border border-[#0071ce]/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Store className="w-4 h-4 text-[#0071ce]" />
                      <span className="font-medium text-[#0071ce]">{sale.store}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{sale.storeAddress}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-[#ffc220]" />
                      <span className="text-sm text-gray-600">{sale.appUsers.toLocaleString()} app users in area</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Quantity Sold</span>
                      <span className="font-medium">
                        {sale.totalQuantity - sale.quantityLeft} / {sale.totalQuantity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-[#0071ce] to-[#0071ce]/80" style={{
                        width: `${((sale.totalQuantity - sale.quantityLeft) / sale.totalQuantity) * 100}%`,
                      }}></div>
                    </div>
                  </div>

                  {/* Freshness Indicator */}
                  <div className="flex items-center justify-between p-3 bg-[#ffc220]/10 rounded-lg border border-[#ffc220]/20">
                    <div className="flex items-center space-x-2">
                      <Timer className="w-4 h-4 text-[#ffc220]" />
                      <span className="text-sm text-yellow-800">Freshness Score</span>
                    </div>
                    <span className="font-bold text-yellow-800">{sale.freshness}%</span>
                  </div>

                  {/* Revenue */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700">Revenue Generated</span>
                    <span className="font-bold text-green-800">₹{sale.revenue.toFixed(2)}</span>
                  </div>

                  {/* Staff Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewFreshnessReport(sale.freshnessReport)} className="flex items-center justify-center">
                      <FileText className="w-4 h-4 mr-1" />
                      Freshness Report
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewBarcode(sale.barcode)} className="flex items-center justify-center">
                      <QrCode className="w-4 h-4 mr-1" />
                      Barcode
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditSale(sale)} className="flex items-center justify-center">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Sale
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteSale(sale.id)} className="flex items-center justify-center">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>))}
            </div>)}

            {salesViewFormat === "list" && (<div className="space-y-4">
              {filteredLiveFlashSales.map((sale) => (<Card key={sale.id} className="hover:shadow-md transition-shadow border-l-4 border-l-[#0071ce]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold">{sale.product}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(sale.status)}>{sale.status}</Badge>
                            <Badge className={getPerformanceColor(sale.performance)}>{sale.performance}</Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{sale.rating}</span>
                              <span className="text-sm text-gray-500">({sale.reviews})</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">₹{sale.salePrice}</div>
                          <div className="text-sm text-gray-500 line-through">₹{sale.originalPrice}</div>
                          <Badge variant="destructive" className="text-xs">-{sale.discount}%</Badge>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Quantity</div>
                          <div className="font-medium">{sale.totalQuantity - sale.quantityLeft} / {sale.totalQuantity}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Freshness</div>
                          <div className="font-medium text-yellow-600">{sale.freshness}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Revenue</div>
                          <div className="font-medium text-green-600">₹{sale.revenue.toFixed(2)}</div>
                        </div>
                        {sale.status === "active" && (<div className="text-center">
                          <div className="text-sm text-gray-600">Time Left</div>
                          <div className="font-medium text-red-600">{sale.timeLeft}</div>
                        </div>)}
                      </div>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Store className="w-4 h-4" />
                          <span>{sale.store}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{sale.storeAddress}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Smartphone className="w-4 h-4" />
                          <span>{sale.appUsers.toLocaleString()} app users</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewFreshnessReport(sale.freshnessReport)}>
                        <FileText className="w-4 h-4 mr-1" />
                        Report
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewBarcode(sale.barcode)}>
                        <QrCode className="w-4 h-4 mr-1" />
                        Barcode
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditSale(sale)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteSale(sale.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>))}
            </div>)}

            {salesViewFormat === "compact" && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLiveFlashSales.map((sale) => (<Card key={sale.id} className="hover:shadow-md transition-shadow border-l-4 border-l-[#0071ce]">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-sm truncate">{sale.product}</h3>
                    <div className="flex items-center justify-center space-x-1">
                      <Badge className={getStatusColor(sale.status)} variant="outline">{sale.status}</Badge>
                      <Badge className={getPerformanceColor(sale.performance)} variant="outline">{sale.performance}</Badge>
                    </div>
                    <div className="text-lg font-bold text-green-600">₹{sale.salePrice}</div>
                    <div className="text-xs text-gray-500 line-through">₹{sale.originalPrice}</div>
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className="text-gray-600">Qty: {sale.quantityLeft}</span>
                      <span className="text-yellow-600">Fresh: {sale.freshness}%</span>
                    </div>
                    {sale.status === "active" && (<div className="text-xs text-red-600 font-medium">{sale.timeLeft}</div>)}
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleEditSale(sale)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleViewBarcode(sale.barcode)}>
                        <QrCode className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1 text-xs" onClick={() => handleDeleteSale(sale.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>))}
            </div>)}
          </>)}
        </TabsContent>

        {/* Flash Sales Management Tab */}
        <TabsContent value="management" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Suggestions */}
            <div className="lg:col-span-1">
              <Card className="border-l-4 border-l-[#0071ce]">
                <CardHeader className="bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-[#0071ce]" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiSuggestionsData.map((suggestion) => (<div key={suggestion.id} className="p-3 bg-[#0071ce]/5 rounded-lg border border-[#0071ce]/20">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="text-xs bg-[#0071ce] text-white">
                        {suggestion.type}
                      </Badge>
                      <Badge className={`text-xs ${suggestion.impact === 'High' ? 'bg-[#ffc220] text-gray-900' :
                        suggestion.impact === 'Medium' ? 'bg-[#0071ce]/20 text-[#0071ce]' :
                          'bg-green-100 text-green-800'}`}>
                        {suggestion.impact}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-2">{suggestion.suggestion}</p>
                    <p className="text-xs text-gray-600 mb-2">{suggestion.reasoning}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Confidence: {suggestion.confidence}%</span>
                      <Button size="sm" className="h-6 text-xs bg-[#0071ce] hover:bg-[#0071ce]/90 text-white">
                        <Zap className="w-3 h-3 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>))}
                </CardContent>
              </Card>
            </div>

            {/* Management Controls */}
            <div className="lg:col-span-2">
              <Card className="border-l-4 border-l-[#0071ce]">
                <CardHeader className="bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-[#0071ce]" />
                    Flash Sales Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Create New Sale */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Product Name</label>
                      <Input placeholder="Enter product name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="produce">Produce</SelectItem>
                          <SelectItem value="dairy">Dairy</SelectItem>
                          <SelectItem value="bakery">Bakery</SelectItem>
                          <SelectItem value="meat">Meat & Seafood</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Original Price</label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Sale Price</label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Quantity</label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Duration (hours)</label>
                      <Input type="number" placeholder="24" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Channel</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online Only</SelectItem>
                          <SelectItem value="in-store">In-Store Only</SelectItem>
                          <SelectItem value="both">Both Channels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Store Location</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select store" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mumbai">Mumbai Supercenter #1234</SelectItem>
                          <SelectItem value="pune">Pune Supercenter #5678</SelectItem>
                          <SelectItem value="thane">Thane Supercenter #9012</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <Textarea placeholder="Enter product description and sale details..." />
                  </div>

                  <div className="flex space-x-3">
                    <Button className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Sale
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Advanced Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics & API Tab */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analytics Dashboard */}
            <div className="space-y-6">
              <Card className="border-l-4 border-l-[#0071ce]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="w-5 h-5 mr-2" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">₹2,36,625</div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1,247</div>
                      <div className="text-sm text-gray-600">Items Sold</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">68%</div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4.7/5</div>
                      <div className="text-sm text-gray-600">Customer Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#0071ce]">
                <CardHeader className="bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-[#0071ce]" />
                    Real-time Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Active Sales</span>
                      <span className="font-bold text-green-600">2</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Waste Prevented</span>
                      <span className="font-bold text-blue-600">70 kg</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Avg. Sale Duration</span>
                      <span className="font-bold text-purple-600">3.2h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Integration */}
            <div className="space-y-6">
              <Card className="border-l-4 border-l-[#0071ce]">
                <CardHeader className="bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2 text-[#0071ce]" />
                    API Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">API Endpoint</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input value="https://api.walmart-optifresh.com/v1/flash-sales" readOnly />
                      <Button size="sm" variant="outline" className="border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/5">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">API Key</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input value="walmart_optifresh_api_key_2025" readOnly />
                      <Button size="sm" variant="outline" className="border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/5">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Data Format</label>
                    <Select defaultValue="json">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-[#0071ce] hover:bg-[#0071ce]/90 text-white font-medium">
                    <Download className="w-4 h-4 mr-2" />
                    Download API Documentation
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#0071ce]">
                <CardHeader className="bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="w-5 h-5 mr-2 text-[#0071ce]" />
                      Sample API Response
                    </div>
                    <Button size="sm" variant="outline" className="h-8 border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/5" onClick={() => {
                      navigator.clipboard.writeText(`{
                  "status": "success",
                  "data": {
                    "flash_sales": [
                      {
                        "id": "fs-001",
                        "product": "Organic Spinach",
                        "original_price": 4.99,
                        "sale_price": 2.99,
                        "discount": 40,
                        "quantity_left": 45,
                        "total_quantity": 100,
                        "time_left": "2h 15m",
                        "freshness_score": 78,
                        "store_location": "Pune Supercenter #1234",
                        "channel": "online",
                        "rating": 4.8,
                        "reviews": 156
                      }
                    ],
                    "analytics": {
                      "total_revenue": 236625,
                      "items_sold": 1247,
                      "conversion_rate": 68,
                      "waste_prevented": "70 kg"
                    }
                  }
                }`);
                    }}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    <pre>{`{
                  "status": "success",
                  "data": {
                    "flash_sales": [
                      {
                        "id": "fs-001",
                        "product": "Organic Spinach",
                        "original_price": 414,
                        "sale_price": 248,
                        "discount": 40,
                        "quantity_left": 45,
                        "total_quantity": 100,
                        "time_left": "2h 15m",
                        "freshness_score": 78,
                        "store_location": "Mumbai Supercenter #1234",
                        "channel": "online",
                        "rating": 4.8,
                        "reviews": 156
                      }
                    ],
                    "analytics": {
                      "total_revenue": 236625,
                      "items_sold": 1247,
                      "conversion_rate": 68,
                      "waste_prevented": "70 kg"
                    }
                  }
                }`}</pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Vendor Requests Tab */}
        <TabsContent value="vendor-requests" className="mt-6">
          {/* Search and Filters Card */}
          <Card className="mb-6 border-l-4 border-l-[#0071ce]">
            <CardHeader className="pb-4 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
              <CardTitle className="flex items-center text-lg">
                <Package className="w-5 h-5 mr-2 text-[#0071ce]" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search vendor requests by product, vendor name, or location..." value={vendorSearchTerm} onChange={(e) => setVendorSearchTerm(e.target.value)} className="pl-10 border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20" />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                  <Select value={vendorStatusFilter} onValueChange={setVendorStatusFilter}>
                    <SelectTrigger className="border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Quality Score</label>
                  <Select value={vendorQualityFilter} onValueChange={setVendorQualityFilter}>
                    <SelectTrigger className="border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20">
                      <SelectValue placeholder="All Quality Scores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quality Scores</SelectItem>
                      <SelectItem value="high">High (90+)</SelectItem>
                      <SelectItem value="medium">Medium (80-89)</SelectItem>
                      <SelectItem value="low">Low (79-)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  {filteredVendorRequests.length} requests found
                </div>
                <Button variant="outline" size="sm" onClick={clearVendorFilters} className="border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/5">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* View Format Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">View Format:</span>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button variant="ghost" size="sm" onClick={() => setVendorViewFormat("grid")} className={`h-8 px-3 ${vendorViewFormat === "grid"
                  ? "bg-white text-[#0071ce] shadow-sm"
                  : "text-gray-600 hover:text-[#0071ce]"}`}>
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setVendorViewFormat("list")} className={`h-8 px-3 ${vendorViewFormat === "list"
                  ? "bg-white text-[#0071ce] shadow-sm"
                  : "text-gray-600 hover:text-[#0071ce]"}`}>
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setVendorViewFormat("compact")} className={`h-8 px-3 ${vendorViewFormat === "compact"
                  ? "bg-white text-[#0071ce] shadow-sm"
                  : "text-gray-600 hover:text-[#0071ce]"}`}>
                  <Columns className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Vendor Requests Content based on view format */}
          {filteredVendorRequests.length === 0 ? (<div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendor requests found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search terms or filters</p>
            <Button variant="outline" onClick={clearVendorFilters}>
              Clear all filters
            </Button>
          </div>) : (<>
            {vendorViewFormat === "grid" && (<div className="space-y-6">
              {filteredVendorRequests.map((request) => (<Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{request.product}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                        <Badge className="bg-blue-100 text-blue-800">{request.vendor}</Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{request.vendorRating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Submitted</div>
                      <div className="font-medium">{request.submittedDate}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{request.quantity}</div>
                      <div className="text-sm text-gray-600">Quantity</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">₹{request.proposedPrice}</div>
                      <div className="text-sm text-gray-600">Proposed Price</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{request.discount}%</div>
                      <div className="text-sm text-gray-600">Discount</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">{request.qualityScore}</div>
                      <div className="text-sm text-gray-600">Quality Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-purple-900">AI Recommendation</span>
                      </div>
                      <p className="text-sm text-purple-800 mb-2">{request.aiRecommendation}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600">Confidence: {request.aiConfidence}%</span>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          {request.wasteReduction} waste reduction
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Vendor History</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{request.vendorHistory}</p>
                      <div className="text-xs text-gray-500">Expires: {request.expiryDate}</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    {request.status === "pending" && (<>
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive" className="flex-1">
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>)}
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Vendor
                    </Button>
                  </div>
                </CardContent>
              </Card>))}
            </div>)}
            {vendorViewFormat === "list" && (<div className="space-y-4">
              {filteredVendorRequests.map((request) => (<Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold">{request.product}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                            <Badge className="bg-blue-100 text-blue-800">{request.vendor}</Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{request.vendorRating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Quantity</div>
                          <div className="font-medium">{request.quantity}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Proposed Price</div>
                          <div className="font-medium text-green-600">₹{request.proposedPrice}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Discount</div>
                          <div className="font-medium text-blue-600">{request.discount}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Quality Score</div>
                          <div className="font-medium text-yellow-600">{request.qualityScore}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">AI Confidence</div>
                          <div className="font-medium text-purple-600">{request.aiConfidence}%</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Submitted: {request.submittedDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Expires: {request.expiryDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Brain className="w-4 h-4" />
                          <span>{request.aiRecommendation}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {request.status === "pending" && (<>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>)}
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>))}
            </div>)}

            {vendorViewFormat === "compact" && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVendorRequests.map((request) => (<Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-sm truncate">{request.product}</h3>
                    <div className="flex items-center justify-center space-x-1">
                      <Badge className={getStatusColor(request.status)} variant="outline">{request.status}</Badge>
                      <Badge className="bg-blue-100 text-blue-800" variant="outline">{request.vendor}</Badge>
                    </div>
                    <div className="text-lg font-bold text-green-600">₹{request.proposedPrice}</div>
                    <div className="text-xs text-gray-500">{request.quantity} units</div>
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className="text-blue-600">-{request.discount}%</span>
                      <span className="text-yellow-600">Q: {request.qualityScore}</span>
                    </div>
                    <div className="text-xs text-purple-600">AI: {request.aiConfidence}%</div>
                    <div className="flex space-x-1">
                      {request.status === "pending" && (<>
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white">
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </>)}
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>))}
            </div>)}
          </>)}
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                  AI Insights & Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUpIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Sales Prediction</span>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">
                    Based on current trends, expect 25% increase in flash sales revenue next week.
                  </p>
                  <div className="text-xs text-blue-600">Confidence: 87%</div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Optimal Timing</span>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">
                    Best time to launch flash sales: Tuesday-Thursday, 6-8 PM IST.
                  </p>
                  <div className="text-xs text-blue-600">Based on 6 months of data</div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Rocket className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Performance Boost</span>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">
                    Adding product images increases conversion rate by 34%.
                  </p>
                  <div className="text-xs text-blue-600">Recommendation: Add high-quality images</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">AI Accuracy Rate</span>
                    <span className="font-bold text-green-600">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Predictions Made</span>
                    <span className="font-bold text-blue-600">1,247</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Revenue Impact</span>
                    <span className="font-bold text-purple-600">+₹32,56,230</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Waste Reduction</span>
                    <span className="font-bold text-green-600">1,062 kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>

    {/* Barcode Modal */}
    <Dialog open={showBarcode} onOpenChange={setShowBarcode}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Barcode</DialogTitle>
        </DialogHeader>
        <div className="text-center p-6">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-300 inline-block">
            <div className="text-2xl font-mono tracking-wider">1234567890123</div>
            <div className="w-64 h-16 bg-black mt-2"></div>
          </div>
          <p className="text-sm text-gray-600 mt-4">Scan this barcode to view product details</p>
        </div>
      </DialogContent>
    </Dialog>

    {/* Freshness Report Modal */}
    <Dialog open={showFreshnessReport} onOpenChange={setShowFreshnessReport}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Freshness Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600">Harvested Date</div>
              <div className="font-medium">2025-01-15</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-sm text-red-600">Expiry Date</div>
              <div className="font-medium">2025-01-20</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">Temperature</div>
              <div className="font-medium">2.5°C</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-600">Humidity</div>
              <div className="font-medium">85%</div>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Quality Assessment</div>
            <div className="font-medium text-green-600">Excellent</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 mb-2">Recommendations</div>
            <ul className="text-sm space-y-1">
              <li>• Consume within 2 days</li>
              <li>• Store at 2-4°C</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>);
}

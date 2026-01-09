import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Thermometer, MapPin, Clock, AlertTriangle, CheckCircle, Truck, Tag, Trash2, } from "lucide-react";
import { ActionModal } from "@/components/action-modal";
import { ProductDetailPanel } from "@/components/product-detail-panel";
export default function CategoryDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  // Change selectedProduct type to any
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState("");
  const categoryData = {
    vegetables: {
      name: "Vegetables",
      color: "bg-green-500",
      products: [
        {
          id: "veg-001",
          name: "Organic Spinach",
          freshness: 85,
          temperature: "35°F",
          humidity: "65%",
          location: "Aisle 12A - Cooler 3",
          risk: "low",
          shelfLife: "3 days",
          quantity: "20 kg",
          lastChecked: "2 hours ago",
          price: "₹349",
          batch: "VEG001-A",
          supplier: "Green Valley Farms",
          receivedDate: "2025-01-15",
          expiryDate: "2025-01-18",
          shelf: "C3-A12",
          image: "/spinach.webp?height=80&width=80",
        },
        {
          id: "veg-002",
          name: "Roma Tomatoes",
          freshness: 72,
          temperature: "38°F",
          humidity: "70%",
          location: "Aisle 12B - Display",
          risk: "medium",
          shelfLife: "2 days",
          quantity: "30 kg",
          lastChecked: "1 hour ago",
          price: "₹249",
          batch: "TOM002-A",
          supplier: "Sunshine Produce",
          receivedDate: "2025-01-15",
          expiryDate: "2025-01-19",
          shelf: "D1-A12B",
          image: "/tomato.webp?height=80&width=80",
        },
        {
          id: "veg-003",
          name: "Iceberg Lettuce",
          freshness: 45,
          temperature: "34°F",
          humidity: "75%",
          location: "Aisle 12A - Cooler 1",
          risk: "critical",
          shelfLife: "8 hours",
          quantity: "10 kg",
          lastChecked: "30 minutes ago",
          price: "₹215",
          batch: "LET001-A",
          supplier: "Fresh Farms",
          receivedDate: "2025-01-15",
          expiryDate: "2025-01-15",
          shelf: "C1-A12",
        },
      ],
    },
    seafood: {
      name: "Seafood",
      color: "bg-blue-500",
      products: [
        {
          id: "sea-001",
          name: "Atlantic Salmon",
          freshness: 78,
          temperature: "32°F",
          humidity: "85%",
          location: "Seafood Counter",
          risk: "medium",
          shelfLife: "1 day",
          quantity: "5 kg",
          lastChecked: "15 minutes ago",
          price: "₹1,149",
          batch: "SAL001-A",
          supplier: "Ocean Fresh",
          receivedDate: "2025-01-15",
          expiryDate: "2025-01-16",
          shelf: "SC-01",
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
  };
  const category = categoryData[params.categoryId];
  if (!category) {
    return <div>Category not found</div>;
  }
  const getRiskColor = (risk) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
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
  const handleAction = (product, action) => {
    setSelectedProduct(product);
    setActionType(action);
  };
  return (<div className="min-h-screen bg-gray-50">
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            <Badge variant="outline">{category.products.length} items</Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="critical">Critical Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freshness">Freshness Score</SelectItem>
                <SelectItem value="risk">Risk Level</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {category.products.map((product) => (<Card key={product.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getRiskColor(product.risk)}>
                    {getRiskIcon(product.risk)}
                    <span className="ml-1">{product.risk} risk</span>
                  </Badge>
                  <span className="text-sm text-gray-500">Last checked: {product.lastChecked}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{product.freshness}%</div>
                <div className="text-sm text-gray-500">Freshness</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Environmental Data */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  <span className="text-gray-600">Temp:</span> {product.temperature}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-200 rounded"></div>
                <span className="text-sm">
                  <span className="text-gray-600">Humidity:</span> {product.humidity}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{product.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm">
                  <span className="text-gray-600">Shelf Life:</span> {product.shelfLife}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Available Quantity</span>
              <span className="font-semibold">{product.quantity}</span>
            </div>

            {/* Freshness Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Freshness Trend</span>
                <span className="text-gray-500">Declining</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${product.freshness > 80
                  ? "bg-green-500"
                  : product.freshness > 60
                    ? "bg-yellow-500"
                    : "bg-red-500"}`} style={{ width: `${product.freshness}%` }}></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => handleAction(product, "transfer")}>
                <Truck className="w-4 h-4 mr-2" />
                Transfer
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => handleAction(product, "flash-sale")}>
                <Tag className="w-4 h-4 mr-2" />
                Flash Sale
              </Button>
              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent" onClick={() => handleAction(product, "remove")}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSelectedProduct(product)}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>))}
      </div>
    </div>

    {/* Action Modal */}
    {selectedProduct && actionType && (<ActionModal product={selectedProduct} actionType={actionType} onClose={() => {
      setSelectedProduct(null);
      setActionType("");
    }} />)}

    {/* Product Detail Panel - Same as in main dashboard */}
    {selectedProduct && !actionType && (<ProductDetailPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />)}
  </div>);
}

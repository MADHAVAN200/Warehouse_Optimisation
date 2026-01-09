"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Upload, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, Target, BarChart3, Search, QrCode, Eye, Package, Users, Camera, Send, ClipboardList, Building, Truck, HelpCircle, XCircle, ChevronDown } from "lucide-react";
export default function VendorPortal() {
    // Add state for step-by-step wizard
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps] = useState(5);
    // Add state for form fields
    const [productName, setProductName] = useState("");
    const [productType, setProductType] = useState("");
    const [reason, setReason] = useState("");
    const [harvestDate, setHarvestDate] = useState("");
    const [shelfLife, setShelfLife] = useState("");
    const [quantity, setQuantity] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState("");
    const [saleChannel, setSaleChannel] = useState("");
    const [certifications, setCertifications] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    // Enhanced submissions state with more details
    const [submissions, setSubmissions] = useState([
        {
            id: "sub-001",
            product: "Organic Tomatoes",
            type: "vegetables",
            harvestDate: "2025-01-10",
            shelfLife: "7 days",
            quantity: "227 kg",
            suggestedPrice: "₹290/kg",
            status: "approved",
            destination: "Flash Sale",
            earnings: "₹1,45,250",
            submittedDate: "2025-01-08",
            approvedDate: "2025-01-09",
            qrCode: "WAL-001-2025-01-08",
            location: "Mumbai, Maharashtra",
            certifications: "Organic, Non-GMO",
            notes: "Excellent quality, fast approval due to organic certification",
            trackingNumber: "TRK-2025-001",
            estimatedDelivery: "2025-01-12",
            actualDelivery: "2025-01-11",
            qualityScore: 95,
            sustainabilityScore: 88
        },
        {
            id: "sub-002",
            product: "Fresh Salmon",
            type: "seafood",
            harvestDate: "2025-01-11",
            shelfLife: "2 days",
            quantity: "45 kg",
            suggestedPrice: "₹990/kg",
            status: "pending",
            destination: "Store Distribution",
            earnings: "Pending",
            submittedDate: "2025-01-10",
            approvedDate: null,
            qrCode: "WAL-002-2025-01-10",
            location: "Pune, Maharashtra",
            certifications: "Wild Caught, Sustainable",
            notes: "Under review for quality assessment",
            trackingNumber: null,
            estimatedDelivery: null,
            actualDelivery: null,
            qualityScore: null,
            sustainabilityScore: null
        },
        {
            id: "sub-003",
            product: "Artisan Bread",
            type: "bakery",
            harvestDate: "2025-01-09",
            shelfLife: "3 days",
            quantity: "200 loaves",
            suggestedPrice: "₹375/loaf",
            status: "rejected",
            destination: "Flash Sale",
            earnings: "₹0",
            submittedDate: "2025-01-08",
            approvedDate: null,
            qrCode: "WAL-003-2025-01-08",
            location: "Thane, Maharashtra",
            certifications: "Artisan, Local",
            notes: "Rejected due to packaging issues",
            trackingNumber: null,
            estimatedDelivery: null,
            actualDelivery: null,
            qualityScore: 65,
            sustainabilityScore: 72
        }
    ]);
    // Track Submissions states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [qrCodeInput, setQrCodeInput] = useState("");
    // Add state for media uploads
    const [photos, setPhotos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [additionalDetails, setAdditionalDetails] = useState("");
    // Add state for success popup
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    // Add payout connection state at the top of the component
    const [payoutMethod, setPayoutMethod] = useState('paypal');
    const [bankDetails, setBankDetails] = useState({ account: '', ifsc: '', name: '' });
    const [businessNumber, setBusinessNumber] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('ryan@paypal.com');
    const [showPayoutForm, setShowPayoutForm] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const [showConnectionModal, setShowConnectionModal] = useState(false);
    // Filter submissions based on search and filters
    const filteredSubmissions = submissions.filter(submission => {
        const matchesSearch = submission.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
            submission.qrCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            submission.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
        let matchesDate = true;
        if (dateFilter === "today") {
            const today = new Date().toISOString().split('T')[0];
            matchesDate = submission.submittedDate === today;
        }
        else if (dateFilter === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDate = new Date(submission.submittedDate) >= weekAgo;
        }
        else if (dateFilter === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            matchesDate = new Date(submission.submittedDate) >= monthAgo;
        }
        return matchesSearch && matchesStatus && matchesDate;
    });
    // Search by QR code
    const searchByQRCode = () => {
        if (qrCodeInput.trim()) {
            setSearchQuery(qrCodeInput.trim());
            setQrCodeInput("");
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-50 text-green-700 border-green-200";
            case "pending":
                return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "rejected":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };
    // Helper function to get step-specific questions
    const getStepQuestions = (step) => {
        switch (step) {
            case 1:
                return {
                    title: "Basic Product Information",
                };
            case 2:
                return {
                    title: `${productType.charAt(0).toUpperCase() + productType.slice(1)} Specific Details`,
                };
            case 3:
                return {
                    title: "Quantity & Pricing",
                };
            case 4:
                return {
                    title: "Location & Certifications",
                };
            case 5:
                return {
                    title: "Review & Submit",
                };
            default:
                return { title: "", description: "" };
        }
    };
    // Simple progress bar with vendor and walmart images
    const ProgressBar = ({ currentStep, totalSteps }) => (<div className="mb-12">
      {/* Vendor and Walmart with Progress Bar Between */}
      <div className="flex items-center justify-between space-x-8 mb-8">
        {/* Vendor Side */}
        <div className="w-24 h-24 flex-shrink-0">
          <img src="/vendor_in.png" alt="Vendor" className="w-full h-full object-contain"/>
        </div>
        
        {/* Blue Progress Track Between */}
        <div className="relative flex-1">
          {/* Background Track */}
          <div className="w-full h-4 bg-gray-200 rounded-full shadow-inner">
            {/* Active Progress */}
            <div className="h-full bg-gradient-to-r from-[#0071ce] to-[#0071ce]/80 rounded-full transition-all duration-1000 ease-out relative shadow-lg" style={{ width: `${(currentStep / totalSteps) * 100}%` }}>
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* Moving Product Box */}
          <div className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out" style={{ left: `calc(${(currentStep / totalSteps) * 100}% - 24px)` }}>
            <div className="w-12 h-12">
              <img src="/box.png" alt="Product Box" className="w-full h-full object-contain"/>
            </div>
          </div>
        </div>
        
        {/* Walmart Side */}
        <div className="w-24 h-24 flex-shrink-0">
          <img src="/walmart.png" alt="Walmart" className="w-full h-full object-contain"/>
        </div>
      </div>
      
      {/* Step Information */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          {getStepQuestions(currentStep).title}
        </h3>
      </div>
    </div>);
    // Enhanced product-specific questions with more details
    const getProductSpecificQuestions = () => {
        switch (productType) {
            case "vegetables":
                return [
                    { field: "harvestDate", label: "Harvest Date", type: "date", help: "When was this harvested?", required: true },
                    { field: "shelfLife", label: "Expected Shelf Life", type: "text", help: "How many days will this stay fresh?", required: true },
                    { field: "growingMethod", label: "Growing Method", type: "select", options: ["Organic", "Conventional", "Hydroponic", "Greenhouse"], help: "How was this grown?", required: false },
                    { field: "pesticideFree", label: "Pesticide Free", type: "checkbox", help: "Is this pesticide-free?", required: false }
                ];
            case "seafood":
                return [
                    { field: "harvestDate", label: "Catch Date", type: "date", help: "When was this caught?", required: true },
                    { field: "shelfLife", label: "Freshness Period", type: "text", help: "How many days will this stay fresh?", required: true },
                    { field: "catchMethod", label: "Catch Method", type: "select", options: ["Wild Caught", "Farm Raised", "Sustainable"], help: "How was this caught?", required: false },
                    { field: "frozen", label: "Previously Frozen", type: "checkbox", help: "Was this previously frozen?", required: false }
                ];
            case "dairy":
                return [
                    { field: "harvestDate", label: "Production Date", type: "date", help: "When was this produced?", required: true },
                    { field: "shelfLife", label: "Expiry Date", type: "date", help: "When does this expire?", required: true },
                    { field: "pasteurized", label: "Pasteurized", type: "checkbox", help: "Is this pasteurized?", required: false },
                    { field: "organic", label: "Organic", type: "checkbox", help: "Is this organic?", required: false }
                ];
            case "bakery":
                return [
                    { field: "harvestDate", label: "Baking Date", type: "date", help: "When was this baked?", required: true },
                    { field: "shelfLife", label: "Best Before", type: "text", help: "How many days will this stay fresh?", required: true },
                    { field: "ingredients", label: "Key Ingredients", type: "text", help: "List main ingredients (optional)", required: false },
                    { field: "glutenFree", label: "Gluten Free", type: "checkbox", help: "Is this gluten-free?", required: false }
                ];
            case "meat":
                return [
                    { field: "harvestDate", label: "Processing Date", type: "date", help: "When was this processed?", required: true },
                    { field: "shelfLife", label: "Use By Date", type: "date", help: "When should this be used by?", required: true },
                    { field: "grade", label: "Meat Grade", type: "select", options: ["Prime", "Choice", "Select", "Standard"], help: "What grade is this meat?", required: false },
                    { field: "grassFed", label: "Grass Fed", type: "checkbox", help: "Is this grass-fed?", required: false }
                ];
            default:
                return [
                    { field: "harvestDate", label: "Production Date", type: "date", help: "When was this produced?", required: true },
                    { field: "shelfLife", label: "Shelf Life", type: "text", help: "How long will this stay fresh?", required: true }
                ];
        }
    };
    // Navigation functions
    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    // Clear form function
    const clearForm = () => {
        setProductName("");
        setProductType("");
        setReason("");
        setHarvestDate("");
        setShelfLife("");
        setQuantity("");
        setDiscountedPrice("");
        setSaleChannel("");
        setCertifications("");
        setLocation("");
        setDescription("");
        setPhotos([]);
        setVideos([]);
        setAdditionalDetails("");
        setCurrentStep(1);
    };
    // Handle form submission
    const handleSubmit = () => {
        // Show success popup
        setShowSuccessPopup(true);
        // Auto-hide popup after 5 seconds
        setTimeout(() => {
            setShowSuccessPopup(false);
            clearForm();
        }, 5000);
        // Close preview modal
        setShowPreview(false);
        // Here you would typically make an API call to submit the data
        console.log("Form submitted successfully");
    };
    // Handle payout connection
    const handlePayoutConnection = (method) => {
        setPayoutMethod(method);
        setIsConnected(true);
        setShowConnectionModal(false);
        setShowPayoutForm(false);
    };
    // Handle disconnect payout
    const handleDisconnectPayout = () => {
        setIsConnected(false);
        setPayoutMethod(null);
        setBankDetails({ account: '', ifsc: '', name: '' });
        setBusinessNumber('');
        setPaypalEmail('');
    };
    return (<div className="min-h-screen bg-gray-50">

      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Product Submission Portal</h2>
              <div className="flex items-center space-x-2 mt-3">
                <Badge className="bg-[#0071ce] text-white border-[#0071ce]">
                  <Target className="w-3 h-3 mr-1"/>
                  2030 Sustainability Partner
                </Badge>
                <Badge className="bg-[#ffc220] text-gray-900 border-[#ffc220]">
                  <CheckCircle className="w-3 h-3 mr-1"/>
                  Verified Vendor
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#ffc220] rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live System</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="submit" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg p-1 shadow-sm">
            <TabsTrigger value="submit" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
              <Package className="w-4 h-4 mr-2"/>
              Submit Product
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
              <Search className="w-4 h-4 mr-2"/>
              Track Submissions
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
              <BarChart3 className="w-4 h-4 mr-2"/>
              Reports
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-[#0071ce] data-[state=active]:text-white data-[state=active]:shadow-md rounded-md font-medium transition-all duration-200">
              <DollarSign className="w-4 h-4 mr-2"/>
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="mt-8">
            <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce]">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                <CardTitle className="text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-[#0071ce]"/>
                  Submit New Product
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Progress Indicator */}
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps}/>

                {/* Step Content */}
                {currentStep === 1 && (<div className="space-y-6">
                    <div>
                      <Label htmlFor="product-name" className="text-sm font-medium text-gray-700">
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      <Input id="product-name" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Organic Spinach" className="mt-2 border-gray-200"/>
                      <div className="text-xs text-gray-500 mt-1">Enter the exact name of your product</div>
                    </div>
                    <div>
                      <Label htmlFor="product-type" className="text-sm font-medium text-gray-700">
                        Product Type <span className="text-red-500">*</span>
                      </Label>
                      <Select value={productType} onValueChange={setProductType}>
                        <SelectTrigger className="mt-2 border-gray-200">
                          <SelectValue placeholder="Select category"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                          <SelectItem value="seafood">Seafood</SelectItem>
                          <SelectItem value="dairy">Dairy</SelectItem>
                          <SelectItem value="bakery">Bakery</SelectItem>
                          <SelectItem value="meat">Meat</SelectItem>
                          <SelectItem value="packaged">Packaged Food</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-gray-500 mt-1">Choose the category that best describes your product</div>
                    </div>
                    <div>
                      <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                        Reason for Submission <span className="text-red-500">*</span>
                      </Label>
                      <Select value={reason} onValueChange={setReason}>
                        <SelectTrigger className="mt-2 border-gray-200">
                          <SelectValue placeholder="Select reason"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expiry">Near Expiry</SelectItem>
                          <SelectItem value="not-selling">Not Selling</SelectItem>
                          <SelectItem value="overstock">Overstock</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-gray-500 mt-1">This helps us understand your situation and provide better pricing</div>
                    </div>
                  </div>)}

                {currentStep === 2 && productType && (<div className="space-y-6">
                    {getProductSpecificQuestions().map((question) => (<div key={question.field}>
                        <Label htmlFor={question.field} className="text-sm font-medium text-gray-700">
                          {question.label} {question.required && <span className="text-red-500">*</span>}
                        </Label>
                        {question.type === "date" ? (<Input id={question.field} type="date" value={question.field === "harvestDate" ? harvestDate : shelfLife} onChange={(e) => {
                        if (question.field === "harvestDate")
                            setHarvestDate(e.target.value);
                        else
                            setShelfLife(e.target.value);
                    }} className="mt-2 border-gray-200"/>) : question.type === "select" ? (<Select>
                            <SelectTrigger className="mt-2 border-gray-200">
                              <SelectValue placeholder={`Select ${question.label.toLowerCase()}`}/>
                            </SelectTrigger>
                            <SelectContent>
                              {question.options?.map((option) => (<SelectItem key={option} value={option.toLowerCase()}>{option}</SelectItem>))}
                            </SelectContent>
                          </Select>) : question.type === "checkbox" ? (<div className="flex items-center mt-2">
                            <input type="checkbox" id={question.field} className="mr-2"/>
                            <Label htmlFor={question.field} className="text-sm">{question.help}</Label>
                          </div>) : (<Input id={question.field} value={question.field === "harvestDate" ? harvestDate : shelfLife} onChange={(e) => {
                        if (question.field === "harvestDate")
                            setHarvestDate(e.target.value);
                        else
                            setShelfLife(e.target.value);
                    }} placeholder={question.field === "harvestDate" ? "YYYY-MM-DD" : "e.g., 7 days"} className="mt-2 border-gray-200"/>)}
                        <div className="text-xs text-gray-500 mt-1">{question.help}</div>
                      </div>))}
                  </div>)}

                {currentStep === 3 && (<div className="space-y-6">
                    <div>
                      <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                        Quantity Available <span className="text-red-500">*</span>
                      </Label>
                      <Input id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g., 227 kg" className="mt-2 border-gray-200"/>
                      <div className="text-xs text-gray-500 mt-1">Specify the total amount you have available</div>
                    </div>
                    <div>
                      <Label htmlFor="discounted-price" className="text-sm font-medium text-gray-700">
                        Your Asking Price <span className="text-red-500">*</span>
                      </Label>
                      <Input id="discounted-price" value={discountedPrice} onChange={(e) => setDiscountedPrice(e.target.value)} placeholder="e.g., ₹207/kg" className="mt-2 border-gray-200"/>
                      <div className="text-xs text-[#0071ce] mt-1 font-medium">
                        💡 Walmart AI Suggestion: ₹200 - ₹232/kg (based on market and expiry)
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="sale-channel" className="text-sm font-medium text-gray-700">
                        Preferred Sale Channel <span className="text-red-500">*</span>
                      </Label>
                      <Select value={saleChannel} onValueChange={setSaleChannel}>
                        <SelectTrigger className="mt-2 border-gray-200">
                          <SelectValue placeholder="Select channel"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flash-sale">Flash Sale (Quick sale at discount)</SelectItem>
                          <SelectItem value="direct">Direct to Walmart (Regular inventory)</SelectItem>
                          <SelectItem value="donation">Donation (Tax benefits available)</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-gray-500 mt-1">Choose how you'd like Walmart to handle your product</div>
                    </div>
                  </div>)}

                {currentStep === 4 && (<div className="space-y-6">
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                        Farm/Production Location <span className="text-red-500">*</span>
                      </Label>
                      <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Mumbai, Maharashtra" className="mt-2 border-gray-200"/>
                      <div className="text-xs text-gray-500 mt-1">Where is your product from?</div>
                    </div>
                    
                    <div>
                      <Label htmlFor="certifications" className="text-sm font-medium text-gray-700">
                        Certifications
                      </Label>
                      <Input id="certifications" value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="e.g., Organic, Non-GMO, Fair Trade" className="mt-2 border-gray-200"/>
                      <div className="text-xs text-gray-500 mt-1">List any certifications your product has (optional but recommended)</div>
                    </div>

                    {/* Media Upload Section */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Product Photos <span className="text-red-500">*</span>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2"/>
                          <p className="text-gray-600 mb-2">Upload clear photos of your product</p>
                          <p className="text-xs text-gray-500 mb-4">Show different angles, packaging, and any defects</p>
                          <input type="file" multiple accept="image/*" onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setPhotos(files);
            }} className="hidden" id="photo-upload"/>
                          <Button variant="outline" size="sm" onClick={() => document.getElementById('photo-upload')?.click()} className="border-gray-200 bg-transparent">
                            Choose Photos
                          </Button>
                          {photos.length > 0 && (<div className="mt-4">
                              <p className="text-sm text-green-600 mb-3">{photos.length} photo(s) selected</p>
                              {/* Photo Preview Grid */}
                              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {photos.map((photo, index) => (<div key={index} className="relative group">
                                    <div className="aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-100 w-16 h-16">
                                      <img src={URL.createObjectURL(photo)} alt={`Product photo ${index + 1}`} className="w-full h-full object-cover"/>
                                    </div>
                                    <button onClick={() => {
                        const newPhotos = photos.filter((_, i) => i !== index);
                        setPhotos(newPhotos);
                    }} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600" title="Remove photo">
                                      ×
                                    </button>
                                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded-tr text-xs">
                                      {Math.round(photo.size / 1024)}KB
                                    </div>
                                  </div>))}
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                                <span className="text-xs text-gray-500">
                                  Total size: {Math.round(photos.reduce((sum, photo) => sum + photo.size, 0) / 1024)}KB
                                </span>
                                <Button variant="outline" size="sm" onClick={() => setPhotos([])} className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-7">
                                  Clear All
                                </Button>
                              </div>
                            </div>)}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Product Video (Optional)
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2"/>
                          <p className="text-gray-600 mb-2">Upload a short video of your product</p>
                          <p className="text-xs text-gray-500 mb-4">Show product quality, packaging, or production process</p>
                          <input type="file" accept="video/*" onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setVideos(files);
            }} className="hidden" id="video-upload"/>
                          <Button variant="outline" size="sm" onClick={() => document.getElementById('video-upload')?.click()} className="border-gray-200 bg-transparent">
                            Choose Video
                          </Button>
                          {videos.length > 0 && (<div className="mt-4">
                              <p className="text-sm text-green-600">{videos.length} video(s) selected</p>
                            </div>)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Additional Details
                      </Label>
                      <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Any additional information about the product, special handling requirements, or unique features..." className="mt-2 border-gray-200" rows={4}/>
                      <div className="text-xs text-gray-500 mt-1">Tell us anything else we should know about your product</div>
                    </div>
                  </div>)}

                {currentStep === 5 && (<div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-4">Submission Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Product:</strong> {productName}</div>
                        <div><strong>Type:</strong> {productType}</div>
                        <div><strong>Reason:</strong> {reason}</div>
                        <div><strong>Quantity:</strong> {quantity}</div>
                        <div><strong>Price:</strong> {discountedPrice}</div>
                        <div><strong>Channel:</strong> {saleChannel}</div>
                        <div><strong>Location:</strong> {location}</div>
                        <div><strong>Certifications:</strong> {certifications}</div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-sm text-yellow-800">
                      <strong>Quick Tips:</strong> Submitting near-expiry or overstock at a lower price increases approval chances. Attach clear images and certifications for faster processing.
                    </div>
                  </div>)}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                    Previous
                  </Button>
                  <div className="flex space-x-4">
                    {currentStep < totalSteps ? (<Button onClick={nextStep} disabled={(currentStep === 1 && (!productName || !productType || !reason)) ||
                (currentStep === 2 && (!harvestDate || !shelfLife)) ||
                (currentStep === 3 && (!quantity || !discountedPrice || !saleChannel)) ||
                (currentStep === 4 && (!location || photos.length === 0))} className="bg-[#0071ce] hover:bg-[#0071ce]/90 text-white font-medium shadow-sm">
                        Next Step
                      </Button>) : (<Button onClick={() => setShowPreview(true)} className="bg-[#0071ce] hover:bg-[#0071ce]/90 text-white font-medium shadow-sm">
                        Submit to Walmart
                      </Button>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="mt-8">
            <div className="space-y-8">

              {/* QR Code Scanner Section */}
              <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce]">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div className="lg:col-span-2">
                      <Label htmlFor="search-submissions" className="text-sm font-medium text-gray-700">Search</Label>
                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input id="search-submissions" placeholder="Search by product, QR code, or tracking number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20 h-11"/>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="status-filter" className="text-sm font-medium text-gray-700">Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger id="status-filter" className="border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20 h-11 mt-2">
                          <SelectValue placeholder="All Status"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date-filter" className="text-sm font-medium text-gray-700">Date</Label>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger id="date-filter" className="border-gray-200 focus:border-[#0071ce] focus:ring-[#0071ce]/20 h-11 mt-2">
                          <SelectValue placeholder="All Time"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">Last 7 Days</SelectItem>
                          <SelectItem value="month">Last 30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <QrCode className="w-5 h-5 mr-2 text-[#0071ce]"/>
                    Track by QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Input placeholder="Enter or scan QR code..." value={qrCodeInput} onChange={(e) => setQrCodeInput(e.target.value)} className="border-gray-200 focus:border-[#ffc220] focus:ring-[#ffc220]/20 h-12 text-lg"/>
                    <Camera className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-[#ffc220]"/>
                  </div>
                  <Button onClick={searchByQRCode} className="bg-[#0071ce] hover:bg-[#0071ce]/90 text-white font-medium h-12 text-lg" disabled={!qrCodeInput.trim()}>
                    <Search className="w-5 h-5 mr-2"/>
                    Track
                  </Button>
                </CardContent>
              </Card>

              {/* Submissions List */}
              <div className="space-y-6">
                {filteredSubmissions.length > 0 ? (filteredSubmissions.map((submission) => (<Collapsible key={submission.id} asChild>
                      <Card className="bg-white border-0 shadow-lg overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${submission.status === 'approved' ? 'from-green-400 to-green-500' :
                submission.status === 'pending' ? 'from-yellow-400 to-yellow-500' :
                    'from-red-400 to-red-500'}`}></div>
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1 mb-4 md:mb-0">
                              <div className="flex items-center mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{submission.product}</h3>
                                <Badge className={`${getStatusColor(submission.status)} ml-3`}>
                                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                Submitted on {submission.submittedDate} &bull; {submission.quantity} &bull; {submission.suggestedPrice}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="font-mono bg-gray-50">{submission.qrCode}</Badge>
                              <CollapsibleTrigger asChild>
                                <Button variant="outline">
                                  <Eye className="w-4 h-4 mr-2"/>
                                  View Details
                                  <ChevronDown className="w-4 h-4 ml-2"/>
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="px-6 pb-6 border-t border-gray-100">
                            {/* Advanced Tracking Timeline */}
                            <div className="mt-6">
                              <h4 className="text-sm font-semibold text-gray-600 mb-4">Submission Journey</h4>
                              <div className="flex items-start justify-between">
                                {/* Step 1: Submitted */}
                                <div className="flex flex-col items-center text-center w-24">
                                  <div className="w-10 h-10 rounded-full bg-[#0071ce] text-white flex items-center justify-center z-10 relative">
                                    <Send className="w-5 h-5"/>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-3 h-3 text-[#0071ce]"/>
                                    </div>
                                  </div>
                                  <p className="text-xs font-medium text-[#0071ce] mt-2">Submitted</p>
                                </div>

                                {/* Connector */}
                                <div className={`flex-1 h-1 mt-5 ${submission.status !== 'rejected' ? 'bg-[#0071ce]' : 'bg-gray-200'}`}></div>

                                {/* Step 2: In Review */}
                                <div className="flex flex-col items-center text-center w-24">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative ${submission.status !== 'rejected' ? 'bg-[#0071ce] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    <ClipboardList className="w-5 h-5"/>
                                    {submission.status !== 'rejected' && (<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-[#0071ce]"/>
                                      </div>)}
                                  </div>
                                  <p className={`text-xs font-medium mt-2 ${submission.status !== 'rejected' ? 'text-[#0071ce]' : 'text-gray-500'}`}>In Review</p>
                                </div>

                                {/* Connector */}
                                <div className={`flex-1 h-1 mt-5 ${submission.status === 'approved' ? 'bg-green-500' : 'bg-gray-200'}`}></div>

                                {/* Step 3: Approved / Rejected */}
                                <div className="flex flex-col items-center text-center w-24">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative ${submission.status === 'approved' ? 'bg-green-500 text-white' :
                submission.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {submission.status === 'approved' && <CheckCircle className="w-5 h-5"/>}
                                    {submission.status === 'rejected' && <XCircle className="w-5 h-5"/>}
                                    {submission.status === 'pending' && <HelpCircle className="w-5 h-5"/>}
                                    
                                    {submission.status !== 'pending' && (<div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center`}>
                                        {submission.status === 'approved' && <CheckCircle className="w-3 h-3 text-green-500"/>}
                                        {submission.status === 'rejected' && <XCircle className="w-3 h-3 text-red-500"/>}
                                      </div>)}
                                  </div>
                                  <p className={`text-xs font-medium mt-2 ${submission.status === 'approved' ? 'text-green-600' :
                submission.status === 'rejected' ? 'text-red-600' : 'text-gray-500'}`}>
                                    {submission.status === 'approved' ? 'Approved' :
                submission.status === 'rejected' ? 'Rejected' : 'Decision'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Live Transit Map for Approved Items */}
                            {submission.status === 'approved' && submission.trackingNumber && (<div className="mt-8">
                                <h4 className="text-sm font-semibold text-gray-600 mb-4">Live Transit</h4>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <div className="flex items-center justify-between space-x-4">
                                    <div className="text-center">
                                      <Users className="w-8 h-8 mx-auto text-gray-500"/>
                                      <p className="text-xs font-bold mt-1">{submission.location.split(',')[0]}</p>
                                      <p className="text-xs text-gray-500">Vendor</p>
                                    </div>
                                    <div className="flex-1 relative">
                                      <div className="h-1 bg-gray-300 rounded-full"></div>
                                      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full" style={{ width: '65%' }}></div>
                                      <div className="absolute top-1/2 transform -translate-y-1/2" style={{ left: '65%' }}>
                                        <Truck className="w-6 h-6 text-white bg-[#0071ce] p-1 rounded-full shadow-lg"/>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <Building className="w-8 h-8 mx-auto text-gray-500"/>
                                      <p className="text-xs font-bold mt-1">Walmart DC</p>
                                      <p className="text-xs text-gray-500">Destination</p>
                                    </div>
                                  </div>
                                  <div className="text-center mt-4">
                                    <p className="text-sm font-medium text-gray-800">Estimated Delivery: {submission.estimatedDelivery}</p>
                                    <p className="text-xs text-gray-500">Tracking ID: {submission.trackingNumber}</p>
                                  </div>
                                </div>
                              </div>)}
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>))) : (<div className="text-center py-16 bg-white rounded-lg border border-dashed">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400"/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Submissions Found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
                    <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setDateFilter("all");
            }} className="border-[#0071ce] text-[#0071ce] hover:bg-[#0071ce]/5">
                      Clear Filters
                    </Button>
                  </div>)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce]">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                  <CardTitle className="flex items-center text-gray-900">
                    <Target className="w-5 h-5 mr-2 text-[#0071ce]"/>
                    Sustainability Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Waste Reduced</span>
                      <span className="font-bold text-gray-900">1,062 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CO2 Saved</span>
                      <span className="font-bold text-gray-900">1.2 tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">2030 Contribution</span>
                      <span className="font-bold text-green-600">+15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce]">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                  <CardTitle className="flex items-center text-gray-900">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600"/>
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Approval Rate</span>
                      <span className="font-bold text-gray-900">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg. Freshness Score</span>
                      <span className="font-bold text-gray-900">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Flash Sale Success</span>
                      <span className="font-bold text-green-600">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce]">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                  <CardTitle className="flex items-center text-gray-900">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600"/>
                    Revenue Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-bold text-gray-900">₹10,33,725</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Month</span>
                      <span className="font-bold text-gray-900">₹8,19,245</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Growth</span>
                      <span className="font-bold text-green-600">+26%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Product-wise Sales Table */}
            <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce] mb-8">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                <CardTitle className="flex items-center text-gray-900">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600"/>
                  Product-wise Sales & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 border">Product</th>
                      <th className="px-4 py-2 border">Type</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Qty</th>
                      <th className="px-4 py-2 border">Revenue</th>
                      <th className="px-4 py-2 border">Approval Reason</th>
                      <th className="px-4 py-2 border">Rejection Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => (<tr key={s.id} className="text-center">
                        <td className="px-4 py-2 border">{s.product}</td>
                        <td className="px-4 py-2 border">{s.type}</td>
                        <td className="px-4 py-2 border capitalize">{s.status}</td>
                        <td className="px-4 py-2 border">{s.quantity}</td>
                        <td className="px-4 py-2 border">{s.earnings}</td>
                        <td className="px-4 py-2 border text-green-700">{s.status === 'approved' ? 'Meets quality & demand' : ''}</td>
                        <td className="px-4 py-2 border text-red-700">{s.status === 'rejected' ? s.notes : ''}</td>
                      </tr>))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Trends & Insights */}
            <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#ffc220] mb-8">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#ffc220]/5 to-transparent">
                <CardTitle className="flex items-center text-gray-900">
                  <TrendingUp className="w-5 h-5 mr-2 text-[#ffc220]"/>
                  Trends & Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Products with certifications have a 20% higher approval rate.</li>
                  <li>Flash Sale submissions are approved 30% faster on average.</li>
                  <li>Rejected products often lack clear photos or have packaging issues.</li>
                  <li>Peak approval times: Mondays and Thursdays (submit early in the week for faster review).</li>
                  <li>Average revenue per approved product: <span className="font-bold text-green-700">₹99,600</span></li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="mt-8">
            <Card className="bg-white border-0 shadow-lg border-l-4 border-l-[#0071ce]">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#0071ce]/5 to-transparent">
                <CardTitle className="text-gray-900 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-[#0071ce]"/>
                  Earnings Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <DollarSign className="w-8 h-8 text-blue-600"/>
                        </div>
                        <div className="text-3xl font-bold text-blue-700 mb-1">₹10,33,725</div>
                        <div className="text-sm text-blue-600 font-medium">Current Month</div>
                        <div className="text-xs text-blue-500 mt-1">+23% from last month</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <TrendingUp className="w-8 h-8 text-blue-600"/>
                        </div>
                        <div className="text-3xl font-bold text-blue-700 mb-1">₹37,56,585</div>
                        <div className="text-sm text-blue-600 font-medium">Total Earnings</div>
                        <div className="text-xs text-blue-500 mt-1">All time revenue</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Clock className="w-8 h-8 text-blue-600"/>
                        </div>
                        <div className="text-3xl font-bold text-blue-700 mb-1">₹1,74,630</div>
                        <div className="text-sm text-blue-600 font-medium">Pending Payment</div>
                        <div className="text-xs text-blue-500 mt-1">Processing in 2-3 days</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payout Connection Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Payout Method</h3>
                    {isConnected && (<Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle className="w-3 h-3 mr-1"/>
                        Connected
                      </Badge>)}
                  </div>
                  
                  {isConnected && payoutMethod ? (<div className="space-y-4">
                      {/* Connected Payout Method Display */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {payoutMethod === 'paypal' && (<>
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">P</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">PayPal</h4>
                                  <p className="text-sm text-gray-600">{paypalEmail}</p>
                                  <div className="flex items-center mt-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    <span className="text-xs text-green-600">Active & Verified</span>
                                  </div>
                                </div>
                              </>)}
                            {payoutMethod === 'bank' && (<>
                                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">B</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">Bank Account</h4>
                                  <p className="text-sm text-gray-600">****{bankDetails.account.slice(-4)}</p>
                                  <p className="text-xs text-gray-500">{bankDetails.name}</p>
                                </div>
                              </>)}
                            {payoutMethod === 'business' && (<>
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">#</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">Business Number</h4>
                                  <p className="text-sm text-gray-600">{businessNumber}</p>
                                </div>
                              </>)}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => setShowConnectionModal(true)} className="border-gray-200">
                              Change
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDisconnectPayout} className="border-red-200 text-red-600 hover:bg-red-50">
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Payment Schedule */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Payment Schedule</h5>
                          <p className="text-sm text-gray-600">Payments are processed every Tuesday and Friday</p>
                          <p className="text-xs text-gray-500 mt-1">Next payment: Friday, August 9th</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Processing Time</h5>
                          <p className="text-sm text-gray-600">2-3 business days for PayPal</p>
                          <p className="text-xs text-gray-500 mt-1">Instant for same-bank transfers</p>
                        </div>
                      </div>
                    </div>) : (<div className="text-center py-8 p-4 bg-yellow-50 rounded border border-yellow-200">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-400"/>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No payout method connected</h3>
                      <p className="text-gray-600 mb-4">Connect a payment method to receive your earnings</p>
                      <Button onClick={() => setShowConnectionModal(true)} className="bg-[#0071ce] hover:bg-[#0071ce]/90 text-white font-medium">
                        Connect Payment Method
                      </Button>
                    </div>)}
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Recent Transactions</h3>
                  {submissions
            .filter((s) => s.status === "approved")
            .map((transaction) => (<Card key={transaction.id} className="border border-gray-200">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{transaction.product}</h4>
                              <p className="text-sm text-gray-600">{transaction.destination}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">{transaction.earnings}</div>
                              <div className="text-sm text-gray-500">Paid</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {showPreview && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Preview Submission</h2>
            <div className="space-y-2 text-sm">
              <div><strong>Product Name:</strong> {productName}</div>
              <div><strong>Product Type:</strong> {productType}</div>
              <div><strong>Harvest Date:</strong> {harvestDate}</div>
              <div><strong>Shelf Life:</strong> {shelfLife}</div>
              <div><strong>Quantity:</strong> {quantity}</div>
              <div><strong>Certifications:</strong> {certifications}</div>
              <div><strong>Location:</strong> {location}</div>
              <div><strong>Description:</strong> {description}</div>
              <div><strong>Reason:</strong> {reason}</div>
              <div><strong>Discounted Price:</strong> {discountedPrice}</div>
              <div><strong>Sale Channel:</strong> {saleChannel}</div>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button className="flex-1 bg-[#0071ce] hover:bg-[#0071ce]/90 text-white font-medium" onClick={handleSubmit}>
                Confirm & Submit
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => setShowPreview(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>)}
      {/* Details Modal for Track Submissions */}
      {showDetails && selectedSubmission && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowDetails(false)} aria-label="Close">
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-[#0071ce]"/>
              Submission Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4">
              <div>
                <div className="mb-2"><strong>Product:</strong> {selectedSubmission.product}</div>
                <div className="mb-2"><strong>Type:</strong> {selectedSubmission.type}</div>
                <div className="mb-2"><strong>Quantity:</strong> {selectedSubmission.quantity}</div>
                <div className="mb-2"><strong>Price:</strong> {selectedSubmission.suggestedPrice}</div>
                <div className="mb-2"><strong>Destination:</strong> {selectedSubmission.destination}</div>
                <div className="mb-2"><strong>Location:</strong> {selectedSubmission.location}</div>
                <div className="mb-2"><strong>Certifications:</strong> {selectedSubmission.certifications}</div>
                <div className="mb-2"><strong>Notes:</strong> {selectedSubmission.notes}</div>
              </div>
              <div>
                <div className="mb-2"><strong>Status:</strong> {selectedSubmission.status}</div>
                <div className="mb-2"><strong>Submitted:</strong> {selectedSubmission.submittedDate}</div>
                <div className="mb-2"><strong>Approved:</strong> {selectedSubmission.approvedDate || '—'}</div>
                <div className="mb-2"><strong>Tracking #:</strong> {selectedSubmission.trackingNumber || '—'}</div>
                <div className="mb-2"><strong>QR Code:</strong> {selectedSubmission.qrCode}</div>
                <div className="mb-2"><strong>Estimated Delivery:</strong> {selectedSubmission.estimatedDelivery || '—'}</div>
                <div className="mb-2"><strong>Actual Delivery:</strong> {selectedSubmission.actualDelivery || '—'}</div>
                <div className="mb-2"><strong>Quality Score:</strong> {selectedSubmission.qualityScore !== null ? selectedSubmission.qualityScore + '/100' : '—'}</div>
                <div className="mb-2"><strong>Sustainability Score:</strong> {selectedSubmission.sustainabilityScore !== null ? selectedSubmission.sustainabilityScore + '/100' : '—'}</div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>)}
      {/* Payout Connection Modal */}
      {showConnectionModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" onClick={() => setShowConnectionModal(false)} aria-label="Close">
              ×
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Payout Method</h2>
              <p className="text-gray-600">Choose how you'd like to receive payments</p>
            </div>
            
            <div className="space-y-4">
              {/* PayPal Option */}
              <div className="p-4 border-2 border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => handlePayoutConnection('paypal')}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">PayPal</h4>
                    <p className="text-sm text-gray-600">Fast and secure payments</p>
                    <p className="text-xs text-green-600 mt-1">✓ Recommended</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-blue-600"/>
                </div>
              </div>
              
              {/* Bank Option */}
              <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handlePayoutConnection('bank')}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Bank Account</h4>
                    <p className="text-sm text-gray-600">Direct bank transfer</p>
                  </div>
                </div>
              </div>
              
              {/* Business Number Option */}
              <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handlePayoutConnection('business')}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">#</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Business Number</h4>
                    <p className="text-sm text-gray-600">Corporate account</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => setShowConnectionModal(false)} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>)}

      {/* Success Popup Modal */}
      {showSuccessPopup && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gradient-to-br from-[#0071ce] to-[#004c87] rounded-lg shadow-xl p-8 w-full max-w-md mx-4 relative animate-in fade-in duration-300">
            {/* Close button */}
            <button className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" onClick={() => {
                setShowSuccessPopup(false);
                clearForm();
            }} aria-label="Close">
              ×
            </button>
            
            {/* Success content */}
            <div className="text-center text-white">
              {/* Success icon */}
              <div className="mx-auto mb-6 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-white"/>
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold mb-4">
                Request Sent Successfully!
              </h2>
              
              {/* Message */}
              <div className="space-y-4 mb-6">
                <p className="text-lg text-white/90">
                  Your request has been sent to <span className="font-semibold text-[#ffc220]">Walmart Opti-Fresh</span>
                </p>
                <p className="text-sm text-white/80">
                  Thanks for contributing to sustainable food and reducing waste. We'll get back to you soon!
                </p>
              </div>
              
              {/* Walmart branding */}
              <div className="flex items-center justify-center space-x-2 text-sm text-white/70">
                <div className="w-2 h-2 bg-[#ffc220] rounded-full"></div>
                <span>Walmart Opti-Fresh Initiative</span>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}

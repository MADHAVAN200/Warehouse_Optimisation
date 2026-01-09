"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Truck, MapPin, AlertTriangle, Thermometer, Navigation, Phone, RotateCcw, RefreshCw, XCircle, Search, Filter, QrCode, Clock, Route, Fuel, ChevronDown, ChevronUp, Package, Eye, Shield, Clock4, ArrowLeft, FileText, AlertCircle, CheckCircle, Zap, Download, FileCheck, User, Calendar, } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// FleetMap component
function FleetMap({ trucks }) {
  // Helper to create custom truck icons
  const createTruckIcon = (status) => {
    const color = status === "in-transit" ? "#3b82f6" :
      status === "delayed" ? "#ef4444" :
        status === "loading" ? "#f59e0b" : "#6b7280";
    return L.divIcon({
      html: `
        <div style="
          background: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">
          🚛
        </div>
      `,
      className: "truck-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };
  return (<MapContainer center={[19.7515, 75.7139]} zoom={7} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
    <TileLayer attribution='&copy;' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {trucks.map((truck) => (<Marker key={truck.id} position={[truck.location.lat, truck.location.lng]} icon={createTruckIcon(truck.status)}>
      <Popup>
        <div className="p-2">
          <div className="font-bold text-lg mb-2">{truck.id}</div>
          <div className="space-y-1 text-sm">
            <div><strong>Driver:</strong> {truck.driver}</div>
            <div><strong>Status:</strong>
              <span className={`ml-1 px-2 py-1 rounded text-xs ${truck.status === "in-transit" ? "bg-blue-100 text-blue-800" :
                truck.status === "delayed" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"}`}>
                {truck.status}
              </span>
            </div>
            <div><strong>Cargo:</strong> {truck.cargo}</div>
            <div><strong>ETA:</strong> {truck.eta}</div>
            <div><strong>Fuel:</strong> {truck.fuelLevel}%</div>
            <div><strong>Location:</strong> {truck.location.address}</div>
          </div>
        </div>
      </Popup>
    </Marker>))}
  </MapContainer>);
}
// FleetMapDynamic removed, use FleetMap directly

export default function LogisticsPage() {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("eta");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedTruck, setExpandedTruck] = useState(null);
  const [expandedShipment, setExpandedShipment] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [selectedAuditItem, setSelectedAuditItem] = useState(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [expandedSLA, setExpandedSLA] = useState(null);
  const [selectedProofOfDelivery, setSelectedProofOfDelivery] = useState(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  // Function to generate blockchain audit trail data
  const generateAuditTrail = (item, type) => {
    const baseData = {
      blockchainNetwork: "Hyperledger Fabric v2.5",
      channelId: "walmart-supply-chain",
      contractName: "OptiFreshTracker",
      verificationTimestamp: new Date().toISOString(),
    };
    if (type === 'truck') {
      return {
        ...baseData,
        entityType: "Vehicle",
        entityId: item.id,
        driver: item.driver,
        driverId: item.driverId,
        auditTrail: [
          {
            timestamp: "2025-01-08T07:30:00Z",
            checkpoint: "Route Initialization",
            verifyingPeer: "peer0.walmart.org",
            transactionHash: "0x7a8b9c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0",
            status: "VERIFIED",
            data: { location: item.location.address, fuel: `${item.fuelLevel}%`, temperature: item.temperature }
          },
          {
            timestamp: "2025-01-08T08:15:00Z",
            checkpoint: "SLA Compliance Check",
            verifyingPeer: "peer1.walmart.org",
            transactionHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3",
            status: "VERIFIED",
            data: { onTimeRate: `${item.performance.onTimeDeliveries}%`, safetyScore: `${item.performance.safetyScore}%` }
          },
          {
            timestamp: "2025-01-08T08:45:00Z",
            checkpoint: "Temperature Monitoring",
            verifyingPeer: "peer2.walmart.org",
            transactionHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4",
            status: "VERIFIED",
            data: { currentTemp: item.temperature, alertsCount: item.alerts.length }
          }
        ]
      };
    }
    else {
      return {
        ...baseData,
        entityType: "Shipment",
        entityId: item.id,
        trackingNumber: item.trackingNumber,
        auditTrail: [
          {
            timestamp: "2025-01-08T07:45:00Z",
            checkpoint: "Shipment Origin Verified",
            verifyingPeer: "peer0.walmart.org",
            transactionHash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5",
            status: "VERIFIED",
            data: { origin: item.origin, freshness: `${item.dispatchFreshness}%`, totalWeight: item.details.totalWeight }
          },
          {
            timestamp: "2025-01-08T08:15:00Z",
            checkpoint: "Route Progress Update",
            verifyingPeer: "peer1.walmart.org",
            transactionHash: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6",
            status: "VERIFIED",
            data: { currentLocation: "Western Express Highway", temperature: item.temperature, humidity: item.humidity }
          },
          {
            timestamp: "2025-01-08T08:40:00Z",
            checkpoint: "Quality Assurance Check",
            verifyingPeer: "peer2.walmart.org",
            transactionHash: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7",
            status: "VERIFIED",
            data: { expectedFreshness: `${item.expectedFreshness}%`, eta: item.eta, insurance: item.details.insurance }
          }
        ]
      };
    }
  };
  const openAuditModal = (item, type) => {
    const auditData = generateAuditTrail(item, type);
    setSelectedAuditItem(auditData);
    setIsAuditModalOpen(true);
  };
  // Function to evaluate SLA compliance using smart contract logic
  const evaluateSLA = (item, type) => {
    const currentTime = new Date();
    const violations = [];
    if (type === 'truck') {
      // Temperature SLA Check
      const tempValue = parseFloat(item.temperature);
      if (tempValue > 25) {
        violations.push({
          type: 'TEMPERATURE_BREACH',
          severity: 'high',
          message: `Temperature ${item.temperature} exceeds limit of 25°C`,
          contractRule: 'IF temperature > 25°C THEN trigger_violation(HIGH)',
          blockchainTx: '0xa1b2c3d4e5f6...',
          timestamp: currentTime.toISOString()
        });
      }
      // On-time delivery SLA
      if (item.performance.onTimeDeliveries < 95) {
        violations.push({
          type: 'DELIVERY_SLA_BREACH',
          severity: 'medium',
          message: `On-time rate ${item.performance.onTimeDeliveries}% below 95% threshold`,
          contractRule: 'IF on_time_rate < 95% THEN trigger_violation(MEDIUM)',
          blockchainTx: '0xf6e5d4c3b2a1...',
          timestamp: currentTime.toISOString()
        });
      }
      // Fuel efficiency SLA
      const fuelEff = parseFloat(item.performance.fuelEfficiency);
      if (fuelEff < 8.0) {
        violations.push({
          type: 'FUEL_EFFICIENCY_BREACH',
          severity: 'low',
          message: `Fuel efficiency ${item.performance.fuelEfficiency} below 8.0 KM/L standard`,
          contractRule: 'IF fuel_efficiency < 8.0 THEN trigger_violation(LOW)',
          blockchainTx: '0x1a2b3c4d5e6f...',
          timestamp: currentTime.toISOString()
        });
      }
    }
    else {
      // Shipment SLA checks
      if (item.status === 'delayed') {
        violations.push({
          type: 'DELIVERY_WINDOW_BREACH',
          severity: 'high',
          message: `Shipment delayed beyond committed delivery window`,
          contractRule: 'IF delivery_time > committed_eta THEN trigger_violation(HIGH)',
          blockchainTx: '0x7g8h9i0j1k2l...',
          timestamp: currentTime.toISOString()
        });
      }
      // Temperature compliance for shipments
      const tempValue = parseFloat(item.temperature);
      if (item.products.some((p) => p.name.includes('Dairy') || p.name.includes('Paneer')) && tempValue > 6) {
        violations.push({
          type: 'COLD_CHAIN_BREACH',
          severity: 'critical',
          message: `Dairy products temperature ${item.temperature} exceeds 6°C limit`,
          contractRule: 'IF product_type = DAIRY AND temperature > 6°C THEN trigger_violation(CRITICAL)',
          blockchainTx: '0x2l3m4n5o6p7q...',
          timestamp: currentTime.toISOString()
        });
      }
      // Freshness degradation SLA
      if (item.expectedFreshness < 85) {
        violations.push({
          type: 'FRESHNESS_SLA_BREACH',
          severity: 'medium',
          message: `Expected freshness ${item.expectedFreshness}% below 85% minimum`,
          contractRule: 'IF expected_freshness < 85% THEN trigger_violation(MEDIUM)',
          blockchainTx: '0x8r9s0t1u2v3w...',
          timestamp: currentTime.toISOString()
        });
      }
    }
    return {
      compliant: violations.length === 0,
      violations,
      lastEvaluated: currentTime.toISOString(),
      smartContractAddress: '0x742d35Cc6663C014f86ECe3f0c',
      evaluationTx: `0x${Math.random().toString(16).slice(2, 18)}...`
    };
  };
  const getSLAStatusColor = (slaData) => {
    if (slaData.compliant)
      return 'bg-green-50 text-green-700 border-green-200';
    const hasHigh = slaData.violations.some((v) => v.severity === 'high' || v.severity === 'critical');
    if (hasHigh)
      return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  };
  // Function to generate blockchain-verified proof of delivery
  const generateProofOfDelivery = (shipment) => {
    if (!shipment.deliveryProof)
      return null;
    return {
      shipmentId: shipment.id,
      trackingNumber: shipment.trackingNumber,
      deliveryDetails: {
        deliveredAt: shipment.deliveryProof.deliveredAt,
        scheduledDelivery: shipment.estimatedArrival,
        actualDelivery: shipment.actualDelivery,
        deliveryStatus: shipment.status,
        origin: shipment.origin,
        destination: shipment.destination,
        driver: shipment.details.driver,
        truck: shipment.truck
      },
      receiverInfo: {
        name: shipment.deliveryProof.receivedBy,
        title: shipment.deliveryProof.receiverTitle,
        signature: shipment.deliveryProof.receiverSignature,
        receivedAt: shipment.deliveryProof.deliveredAt
      },
      conditionReport: {
        overallCondition: shipment.deliveryProof.conditionOnDelivery,
        qualityScore: shipment.deliveryProof.qualityScore,
        temperatureAtDelivery: shipment.deliveryProof.temperatureAtDelivery,
        photographicEvidence: shipment.deliveryProof.photographicEvidence
      },
      blockchainVerification: {
        transactionHash: shipment.deliveryProof.blockchainTx,
        blockNumber: shipment.deliveryProof.blockNumber,
        networkValidation: shipment.deliveryProof.networkValidation,
        smartContractAddress: "0x742d35Cc6663C014f86ECe3f0c",
        hyperledgerChannel: "walmart-delivery-proofs"
      },
      products: shipment.products,
      totalValue: shipment.details.totalValue,
      totalWeight: shipment.details.totalWeight,
      insurance: shipment.details.insurance
    };
  };
  const openProofOfDeliveryModal = (shipment) => {
    const proofData = generateProofOfDelivery(shipment);
    setSelectedProofOfDelivery(proofData);
    setIsProofModalOpen(true);
  };
  const downloadBlockchainPDF = (proofData) => {
    // In a real implementation, this would generate and download a PDF
    const receiptContent = `
WALMART BLOCKCHAIN DELIVERY RECEIPT
=================================

Shipment ID: ${proofData.shipmentId}
Tracking: ${proofData.trackingNumber}
Delivered: ${new Date(proofData.deliveryDetails.deliveredAt).toLocaleString()}
Receiver: ${proofData.receiverInfo.name} (${proofData.receiverInfo.title})
Quality Score: ${proofData.conditionReport.qualityScore}/100

BLOCKCHAIN VERIFICATION:
Transaction: ${proofData.blockchainVerification.transactionHash}
Block: ${proofData.blockchainVerification.blockNumber}
Network: Hyperledger Fabric
Channel: ${proofData.blockchainVerification.hyperledgerChannel}

This receipt is cryptographically secured and tamper-proof.
    `;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `walmart-delivery-receipt-${proofData.shipmentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  const trucks = [
    {
      id: "TRK-001",
      driver: "Ashwini Rane",
      driverId: "D-IN007",
      status: "loading",
      type: "inter-store",
      route: "Store #014 → Store #015",
      eta: "Loading...",
      cargo: "Kitchenware",
      temperature: "30°C",
      priority: "low",
      location: { lat: 19.2189, lng: 72.9780, address: "Kandivali, Mumbai" },
      alerts: [],
      phone: "+91-9876543107",
      fuelLevel: 85,
      mileage: "134,200 km",
      lastMaintenance: "2025-07-12",
      nextMaintenance: "2025-08-12",
      routeHistory: [
        { time: "09:00", location: "Store #014", status: "arrived" },
        { time: "09:10", location: "Store #014", status: "loading" },
      ],
      performance: {
        onTimeDeliveries: 98,
        avgDeliveryTime: "1.9 hours",
        fuelEfficiency: "9.2 KM/L",
        safetyScore: 99,
      },
    },
    {
      id: "TRK-002",
      driver: "Sunil More",
      driverId: "D-IN008",
      status: "in-transit",
      type: "delivery",
      route: "Store #016 → Store #017",
      eta: "20 minutes",
      cargo: "Bakery Products",
      temperature: "22°C",
      priority: "high",
      location: { lat: 19.9975, lng: 73.7898, address: "Nashik Bypass" },
      alerts: [],
      phone: "+91-9876543108",
      fuelLevel: 60,
      mileage: "145,350 km",
      lastMaintenance: "2025-07-15",
      nextMaintenance: "2025-08-15",
      routeHistory: [
        { time: "08:30", location: "Store #016", status: "departed" },
        { time: "09:00", location: "Nashik Bypass", status: "in-transit" },
      ],
      performance: {
        onTimeDeliveries: 93,
        avgDeliveryTime: "2.6 hours",
        fuelEfficiency: "8.6 KM/L",
        safetyScore: 97,
      },
    },
    {
      id: "TRK-003",
      driver: "Priya Naik",
      driverId: "D-IN009",
      status: "in-transit",
      type: "pickup",
      route: "Store #018 → Store #019",
      eta: "40 minutes",
      cargo: "Books & Stationery",
      temperature: "26°C",
      priority: "medium",
      location: { lat: 19.8762, lng: 75.3433, address: "Aurangabad Highway" },
      alerts: [],
      phone: "+91-9876543109",
      fuelLevel: 78,
      mileage: "120,670 km",
      lastMaintenance: "2025-07-18",
      nextMaintenance: "2025-08-18",
      routeHistory: [
        { time: "08:45", location: "Store #018", status: "departed" },
        { time: "09:20", location: "Aurangabad City", status: "in-transit" },
      ],
      performance: {
        onTimeDeliveries: 95,
        avgDeliveryTime: "2.2 hours",
        fuelEfficiency: "8.9 KM/L",
        safetyScore: 96,
      },
    },
    {
      id: "TRK-004",
      driver: "Amit Patil",
      driverId: "D-IN001",
      status: "in-transit",
      type: "pickup",
      route: "Store #004 → Store #005",
      eta: "30 minutes",
      cargo: "Pharmaceutical Supplies",
      temperature: "28°C",
      priority: "high",
      location: { lat: 19.2183, lng: 72.9781, address: "Borivali, Mumbai" },
      alerts: [],
      phone: "+91-9876543101",
      fuelLevel: 68,
      mileage: "121,300 km",
      lastMaintenance: "2025-07-01",
      nextMaintenance: "2025-08-01",
      routeHistory: [
        { time: "09:00", location: "Store #004", status: "departed" },
        { time: "09:30", location: "Western Express Highway", status: "in-transit" },
      ],
      performance: {
        onTimeDeliveries: 97,
        avgDeliveryTime: "2.1 hours",
        fuelEfficiency: "9.0 KM/L",
        safetyScore: 95,
      },
    },
    {
      id: "TRK-005",
      driver: "Sneha Kulkarni",
      driverId: "D-IN002",
      status: "delayed",
      type: "delivery",
      route: "Warehouse → Store #006",
      eta: "1h 45m (delayed)",
      cargo: "Frozen Foods",
      temperature: "-5°C",
      priority: "medium",
      location: { lat: 19.9975, lng: 73.7898, address: "Nashik Road, Nashik" },
      alerts: [{ type: "delay", message: "Heavy traffic near Nashik Phata", severity: "high" }],
      phone: "+91-9876543102",
      fuelLevel: 55,
      mileage: "102,500 km",
      lastMaintenance: "2025-06-28",
      nextMaintenance: "2025-07-28",
      routeHistory: [
        { time: "08:00", location: "Navi Mumbai Warehouse", status: "departed" },
        { time: "09:15", location: "Mumbai-Nashik Highway", status: "in-transit" },
      ],
      performance: {
        onTimeDeliveries: 90,
        avgDeliveryTime: "3.0 hours",
        fuelEfficiency: "8.4 KM/L",
        safetyScore: 93,
      },
    },
    {
      id: "TRK-006",
      driver: "Rajesh Pawar",
      driverId: "D-IN003",
      status: "loading",
      type: "inter-store",
      route: "Store #007 → Store #008",
      eta: "Loading...",
      cargo: "Home Appliances",
      temperature: "30°C",
      priority: "low",
      location: { lat: 18.5204, lng: 73.8567, address: "Store #007, Pune Central" },
      alerts: [],
      phone: "+91-9876543103",
      fuelLevel: 80,
      mileage: "142,890 km",
      lastMaintenance: "2025-07-10",
      nextMaintenance: "2025-08-10",
      routeHistory: [
        { time: "08:45", location: "Store #007", status: "arrived" },
        { time: "09:00", location: "Store #007", status: "loading" },
      ],
      performance: {
        onTimeDeliveries: 96,
        avgDeliveryTime: "2.5 hours",
        fuelEfficiency: "8.7 KM/L",
        safetyScore: 97,
      },
    },
    {
      id: "TRK-007",
      driver: "Farhan Shaikh",
      driverId: "D-IN004",
      status: "in-transit",
      type: "pickup",
      route: "Store #009 → Store #010",
      eta: "50 minutes",
      cargo: "Electronics",
      temperature: "32°C",
      priority: "high",
      location: { lat: 19.2056, lng: 72.8656, address: "Andheri East, Mumbai" },
      alerts: [],
      phone: "+91-9876543104",
      fuelLevel: 62,
      mileage: "198,320 km",
      lastMaintenance: "2025-07-05",
      nextMaintenance: "2025-08-05",
      routeHistory: [
        { time: "08:00", location: "Store #009", status: "departed" },
        { time: "08:40", location: "Saki Naka", status: "in-transit" },
      ],
      performance: {
        onTimeDeliveries: 94,
        avgDeliveryTime: "2.0 hours",
        fuelEfficiency: "7.9 KM/L",
        safetyScore: 96,
      },
    },
    {
      id: "TRK-008",
      driver: "Meena Deshmukh",
      driverId: "D-IN005",
      status: "in-transit",
      type: "delivery",
      route: "Store #011 → Store #012",
      eta: "35 minutes",
      cargo: "Clothing",
      temperature: "29°C",
      priority: "medium",
      location: { lat: 18.7500, lng: 73.4000, address: "Lonavala Main Road" },
      alerts: [],
      phone: "+91-9876543105",
      fuelLevel: 70,
      mileage: "174,250 km",
      lastMaintenance: "2025-07-08",
      nextMaintenance: "2025-08-08",
      routeHistory: [
        { time: "08:30", location: "Store #011", status: "departed" },
        { time: "09:10", location: "Expressway Exit", status: "in-transit" },
      ],
      performance: {
        onTimeDeliveries: 91,
        avgDeliveryTime: "2.4 hours",
        fuelEfficiency: "8.3 KM/L",
        safetyScore: 94,
      },
    },
    {
      id: "TRK-009",
      driver: "Nikhil Jadhav",
      driverId: "D-IN006",
      status: "delayed",
      type: "pickup",
      route: "Warehouse → Store #013",
      eta: "Delayed - 1h 30m",
      cargo: "Mobile Devices",
      temperature: "27°C",
      priority: "high",
      location: { lat: 19.0330, lng: 73.0297, address: "Belapur, Navi Mumbai" },
      alerts: [{ type: "delay", message: "Breakdown assistance en route", severity: "high" }],
      phone: "+91-9876543106",
      fuelLevel: 30,
      mileage: "110,800 km",
      lastMaintenance: "2025-07-03",
      nextMaintenance: "2025-08-03",
      routeHistory: [
        { time: "07:30", location: "Panvel Warehouse", status: "departed" },
        { time: "08:15", location: "Belapur Sector 11", status: "halted" },
      ],
      performance: {
        onTimeDeliveries: 89,
        avgDeliveryTime: "3.2 hours",
        fuelEfficiency: "7.5 KM/L",
        safetyScore: 91,
      },
    },
  ];
  const alerts = [
    {
      id: "alert-sla-001",
      type: "sla_breach",
      severity: "critical",
      message: "SLA Breach Detected – Verified by Blockchain: Dairy cold chain temperature violation",
      time: "2 minutes ago",
      truck: "TRK-004",
      actionRequired: true,
      location: "Western Express Highway",
      estimatedLoss: "₹45,000",
      recommendedAction: "Immediate temperature correction and route priority escalation",
      affectedProducts: ["Paneer Blocks", "Buffalo Milk", "Lassi Cups"],
      smartContract: {
        triggered: true,
        contractAddress: "0x742d35Cc6663C014f86ECe3f0c",
        rule: "IF product_type = DAIRY AND temperature > 6°C THEN trigger_violation(CRITICAL)",
        transactionHash: "0x2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4",
        blockNumber: "18,524,981",
        gasUsed: "124,567",
        timestamp: "2025-08-05T09:42:15Z",
        verifyingPeers: ["peer0.walmart.org", "peer1.dairy-suppliers.org", "peer2.logistics.org"]
      },
      details: {
        currentTemp: "8.5°C",
        targetTemp: "≤ 6°C",
        violationDuration: "12 minutes",
        driver: "Amit Patil",
        nextStop: "Store #006",
        eta: "28 minutes",
      },
    },
    {
      id: "alert-sla-002",
      type: "sla_breach",
      severity: "high",
      message: "SLA Breach Detected – Verified by Blockchain: Delivery window violation imminent",
      time: "5 minutes ago",
      truck: "TRK-005",
      actionRequired: true,
      location: "Chinchwad",
      estimatedLoss: "₹18,500",
      recommendedAction: "Expedite route or notify customer of delay",
      affectedProducts: ["Paneer Blocks", "Buffalo Milk"],
      smartContract: {
        triggered: true,
        contractAddress: "0x742d35Cc6663C014f86ECe3f0c",
        rule: "IF current_time + estimated_travel > committed_delivery_time THEN trigger_violation(HIGH)",
        transactionHash: "0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9",
        blockNumber: "18,524,978",
        gasUsed: "89,432",
        timestamp: "2025-08-05T09:39:22Z",
        verifyingPeers: ["peer0.walmart.org", "peer1.logistics.org", "peer2.timekeeper.org"]
      },
      details: {
        commitmentTime: "09:00 AM",
        currentETA: "09:45 AM",
        delayAmount: "45 minutes",
        driver: "Sneha Kulkarni",
        nextStop: "Store #006",
        originalEta: "09:00 AM",
      },
    },
    {
      id: "alert-001",
      type: "temperature",
      severity: "high",
      message: "TRK-011 - Bakery products exposed to high temperature (36°C)",
      time: "10 minutes ago",
      truck: "TRK-011",
      actionRequired: true,
      location: "Nashik Bypass",
      estimatedLoss: "₹25,000",
      recommendedAction: "Cooler reset or transfer products",
      affectedProducts: ["Cakes", "Bread", "Pastries"],
      details: {
        currentTemp: "36°C",
        targetTemp: "22°C",
        duration: "18 minutes",
        driver: "Sunil More",
        nextStop: "Store #017",
        eta: "25 minutes",
      },
    },
    {
      id: "alert-002",
      type: "route deviation",
      severity: "medium",
      message: "TRK-012 deviated from planned route",
      time: "7 minutes ago",
      truck: "TRK-012",
      actionRequired: true,
      location: "Aurangabad Industrial Area",
      estimatedLoss: "₹4,000",
      recommendedAction: "Contact driver, validate alternate path",
      affectedProducts: ["Books", "Diaries"],
      details: {
        originalRoute: "NH 52",
        currentPath: "Via MIDC Phase 2",
        reason: "Avoiding roadblock",
        driver: "Priya Naik",
      },
    },
    {
      id: "alert-003",
      type: "connectivity",
      severity: "low",
      message: "TRK-006 telemetry lost for 5 minutes",
      time: "2 minutes ago",
      truck: "TRK-006",
      actionRequired: false,
      location: "Pune Camp Area",
      estimatedLoss: "₹0",
      recommendedAction: "Resume tracking once reconnected",
      affectedProducts: ["Microwaves", "Blenders"],
      details: {
        duration: "5 minutes",
        lastKnown: "Pune Railway Station",
        driver: "Rajesh Pawar",
      },
    },
    {
      id: "alert-004",
      type: "temperature",
      severity: "high",
      message: "Temperature breach in Truck TRK-004 - Seafood cargo at 18°C",
      time: "8 minutes ago",
      truck: "TRK-004",
      actionRequired: true,
      location: "Western Express Highway, Mumbai",
      estimatedLoss: "₹2,10,000",
      recommendedAction: "Immediate reroute to nearest store",
      affectedProducts: ["Pomfret", "Tiger Prawns", "Rohu Fish"],
      details: {
        currentTemp: "18°C",
        targetTemp: "4°C",
        duration: "12 minutes",
        driver: "Amit Patil",
        nextStop: "Store #005",
        eta: "20 minutes",
      },
    },
    {
      id: "alert-005",
      type: "delay",
      severity: "medium",
      message: "Truck TRK-005 delayed due to accident on Nashik Phata",
      time: "12 minutes ago",
      truck: "TRK-005",
      actionRequired: false,
      location: "Nashik Phata, Pune",
      estimatedLoss: "₹12,000",
      recommendedAction: "Monitor progress, notify destination store",
      affectedProducts: ["Paneer", "Milk", "Curd"],
      details: {
        originalETA: "10:00 AM",
        newETA: "10:40 AM",
        trafficCause: "Overturned truck",
        alternateRoute: "Available via Old Mumbai-Pune Road",
        driver: "Sneha Kulkarni",
      },
    },
    {
      id: "alert-006",
      type: "fuel",
      severity: "high",
      message: "TRK-006 fuel level critical - 12% remaining",
      time: "6 minutes ago",
      truck: "TRK-006",
      actionRequired: true,
      location: "Swargate, Pune",
      estimatedLoss: "₹18,000",
      recommendedAction: "Refuel at nearest station",
      affectedProducts: ["Microwave Ovens", "Blenders"],
      details: {
        currentFuel: "12%",
        rangeRemaining: "35 km",
        nearestStation: "IndianOil - Tilak Road",
        distanceToStation: "3.5 km",
        driver: "Rajesh Pawar",
      },
    },
    {
      id: "alert-007",
      type: "mechanical",
      severity: "high",
      message: "Brake system alert in TRK-007 - Reduced stopping performance",
      time: "3 minutes ago",
      truck: "TRK-007",
      actionRequired: true,
      location: "Jogeshwari Link Road, Mumbai",
      estimatedLoss: "₹30,000",
      recommendedAction: "Emergency maintenance stop",
      affectedProducts: ["Mobile Phones", "Laptops"],
      details: {
        issue: "Hydraulic brake fluid leak",
        driver: "Farhan Shaikh",
        nearestServiceCenter: "Tata Motors - Goregaon",
        distanceToCenter: "6 km",
      },
    },
    {
      id: "alert-008",
      type: "temperature",
      severity: "medium",
      message: "TRK-008 internal temperature rising - HVAC system degraded",
      time: "20 minutes ago",
      truck: "TRK-008",
      actionRequired: false,
      location: "Old Mumbai Pune Highway, Lonavala",
      estimatedLoss: "₹8,500",
      recommendedAction: "Monitor system logs and cooling unit",
      affectedProducts: ["Jackets", "Shirts"],
      details: {
        currentTemp: "34°C",
        targetTemp: "30°C",
        duration: "10 minutes",
        driver: "Meena Deshmukh",
        nextStop: "Store #012",
        eta: "40 minutes",
      },
    },
    {
      id: "alert-009",
      type: "delay",
      severity: "high",
      message: "TRK-009 stuck due to breakdown near Belapur",
      time: "25 minutes ago",
      truck: "TRK-009",
      actionRequired: true,
      location: "Belapur, Navi Mumbai",
      estimatedLoss: "₹60,000",
      recommendedAction: "Tow assistance and route reassignment",
      affectedProducts: ["Mobile Devices"],
      details: {
        issue: "Engine overheat",
        driver: "Nikhil Jadhav",
        supportETA: "15 minutes",
        nextStop: "Store #013",
      },
    },
    {
      id: "alert-010",
      type: "safety",
      severity: "medium",
      message: "Driver in TRK-010 exceeded speed limit in residential area",
      time: "18 minutes ago",
      truck: "TRK-010",
      actionRequired: false,
      location: "Kandivali West, Mumbai",
      estimatedLoss: "₹0",
      recommendedAction: "Send warning to driver",
      affectedProducts: ["Steel Utensils", "Pressure Cookers"],
      details: {
        speed: "68 km/h",
        limit: "50 km/h",
        cameraZone: true,
        driver: "Ashwini Rane",
      },
    },
  ];
  const shipments = [
    {
      id: "SHP-001",
      qrCode: "QR-SHP003-2025",
      trackingNumber: "WM-SHP-003-2025-0805",
      products: [
        { name: "Alphonso Mangoes", sku: "FRU-001", quantity: "100 kg", freshness: 88 },
        { name: "Banana Bunches", sku: "FRU-002", quantity: "80 kg", freshness: 85 },
        { name: "Guavas", sku: "FRU-003", quantity: "60 kg", freshness: 84 },
      ],
      origin: "Store #004",
      destination: "Store #005",
      truck: "TRK-004",
      dispatchFreshness: 88,
      expectedFreshness: 85,
      eta: "50 minutes",
      status: "in-transit",
      blockchain: "verified",
      route: ["Store #004", "Western Express Highway", "Borivali", "Store #005"],
      dispatchTime: "07:45 AM",
      estimatedArrival: "09:00 AM",
      temperature: "14°C",
      humidity: "55%",
      gpsTracking: { lat: 19.2183, lng: 72.9781 }, // Borivali, Mumbai
      milestones: [
        { location: "Store #004", time: "07:45", status: "completed", description: "Shipment loaded and departed" },
        { location: "Western Express Highway", time: "08:15", status: "completed", description: "Midway through route" },
        { location: "Borivali", time: "08:40", status: "current", description: "Crossing northern Mumbai" },
        { location: "Store #005", time: "09:00", status: "pending", description: "Expected delivery at destination" },
      ],
      details: {
        totalWeight: "240 kg",
        totalValue: "₹14,800",
        driver: "Amit Patil",
        vehicleType: "Refrigerated Truck",
        insurance: "Covered up to ₹1,00,000",
        specialInstructions: "Deliver before noon - perishable seasonal fruit",
      },
    },
    {
      id: "SHP-002",
      qrCode: "QR-SHP004-2025",
      trackingNumber: "WM-SHP-004-2025-0805",
      products: [
        { name: "Paneer Blocks", sku: "DAI-004", quantity: "20 kg", freshness: 91 },
        { name: "Buffalo Milk", sku: "DAI-005", quantity: "50 litres", freshness: 90 },
        { name: "Lassi Cups", sku: "DAI-006", quantity: "200 units", freshness: 89 },
      ],
      origin: "Warehouse - Pune Industrial Zone",
      destination: "Store #006",
      truck: "TRK-005",
      dispatchFreshness: 91,
      expectedFreshness: 88,
      eta: "1h 30m (delayed)",
      status: "delayed",
      blockchain: "pending",
      route: ["Pune Warehouse", "Nashik Phata", "Chinchwad", "Store #006"],
      dispatchTime: "06:30 AM",
      estimatedArrival: "09:00 AM",
      temperature: "4°C",
      humidity: "75%",
      gpsTracking: { lat: 18.5800, lng: 73.7700 }, // Near Chinchwad, Pune
      milestones: [
        {
          location: "Pune Warehouse",
          time: "06:30",
          status: "completed",
          description: "Dispatched from warehouse",
        },
        { location: "Nashik Phata", time: "07:15", status: "completed", description: "Traffic congestion" },
        { location: "Chinchwad", time: "08:00", status: "delayed", description: "Slow movement - possible late delivery" },
        { location: "Store #006", time: "09:00", status: "pending", description: "Expected arrival (delayed)" },
      ],
      details: {
        totalWeight: "135 kg",
        totalValue: "₹9,650",
        driver: "Sneha Kulkarni",
        vehicleType: "Refrigerated Truck",
        insurance: "Covered up to ₹50,000",
        specialInstructions: "Ensure temperature remains constant - dairy products",
      },
    },
    {
      id: "SHP-003",
      qrCode: "QR-SHP005-2025",
      trackingNumber: "WM-SHP-005-2025-0805",
      products: [
        { name: "Fresh Lettuce", sku: "VEG-001", quantity: "50 kg", freshness: 92 },
        { name: "Tomatoes", sku: "VEG-002", quantity: "40 kg", freshness: 90 },
        { name: "Onions", sku: "VEG-003", quantity: "30 kg", freshness: 88 },
      ],
      origin: "Farm Direct - Nashik",
      destination: "Store #007",
      truck: "TRK-006",
      dispatchFreshness: 92,
      expectedFreshness: 89,
      eta: "Delivered",
      status: "delivered",
      blockchain: "verified",
      route: ["Farm Direct - Nashik", "Highway NH-50", "Pune Circle", "Store #007"],
      dispatchTime: "05:30 AM",
      estimatedArrival: "08:30 AM",
      actualDelivery: "08:25 AM",
      temperature: "18°C",
      humidity: "65%",
      gpsTracking: { lat: 18.5204, lng: 73.8567 },
      milestones: [
        { location: "Farm Direct - Nashik", time: "05:30", status: "completed", description: "Fresh produce loaded directly from farm" },
        { location: "Highway NH-50", time: "06:45", status: "completed", description: "Highway transit phase" },
        { location: "Pune Circle", time: "07:50", status: "completed", description: "Final approach to destination" },
        { location: "Store #007", time: "08:25", status: "delivered", description: "Successfully delivered to store" },
      ],
      details: {
        totalWeight: "120 kg",
        totalValue: "₹8,400",
        driver: "Rajesh Kulkarni",
        vehicleType: "Refrigerated Truck",
        insurance: "Covered up to ₹75,000",
        specialInstructions: "Handle with care - premium organic produce",
      },
      deliveryProof: {
        deliveredAt: "2025-08-05T08:25:00Z",
        receivedBy: "Priya Sharma",
        receiverTitle: "Store Manager",
        receiverSignature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA...",
        conditionOnDelivery: "Excellent - all items fresh and undamaged",
        temperatureAtDelivery: "18°C",
        qualityScore: 94,
        photographicEvidence: ["delivery_photo_1.jpg", "quality_check_1.jpg"],
        blockchainTx: "0x9d8e7f6g5h4i3j2k1l0m9n8o7p6q5r4s3t2u1v0w9x8y7z6a5b4c3d2e1f0g9h8i7",
        blockNumber: "18,525,045",
        networkValidation: {
          verifyingPeers: ["peer0.walmart.org", "peer1.store007.org", "peer2.logistics.org"],
          consensusTimestamp: "2025-08-05T08:26:15Z",
          validationStatus: "CONFIRMED"
        }
      },
    }
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "in-transit":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "delayed":
        return "bg-red-50 text-red-700 border-red-200";
      case "loading":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "idle":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const getAlertIcon = (type) => {
    switch (type) {
      case "temperature":
        return <Thermometer className="w-4 h-4" />;
      case "delay":
        return <Clock className="w-4 h-4" />;
      case "route":
        return <Route className="w-4 h-4" />;
      case "maintenance":
        return <Truck className="w-4 h-4" />;
      case "fuel":
        return <Fuel className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };
  const handleTruckAction = (truckId, action) => {
    console.log(`Action: ${action} on truck: ${truckId}`);
  };
  const handleAlertAction = (alertId, action) => {
    console.log(`Alert action: ${action} on alert: ${alertId}`);
  };
  const filteredTrucks = trucks
    .filter((truck) => {
      if (filterStatus !== "all" && truck.status !== filterStatus)
        return false;
      if (searchQuery &&
        !truck.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !truck.driver.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "eta":
          return a.eta.localeCompare(b.eta);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "driver":
          return a.driver.localeCompare(b.driver);
        case "fuel":
          return b.fuelLevel - a.fuelLevel;
        default:
          return 0;
      }
    });
  return (<div className="min-h-screen bg-gray-50 pt-6">
    <div className="p-6 max-w-7xl mx-auto">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Logistics Command Center</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">System Status</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <TabsTrigger value="map" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium transition-all hover:bg-blue-50">
            Live Fleet Map
          </TabsTrigger>
          <TabsTrigger value="trucks" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium transition-all hover:bg-blue-50">
            Fleet Management
          </TabsTrigger>
          <TabsTrigger value="shipments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium transition-all hover:bg-blue-50">
            Shipment Tracking
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium transition-all hover:bg-blue-50">
            Active Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-6">
          {/* Fleet Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Active Trucks</p>
                    <p className="text-2xl font-bold text-blue-900">{trucks.length}</p>
                    <p className="text-xs text-blue-600 mt-1">+2 from yesterday</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">In Transit</p>
                    <p className="text-2xl font-bold text-green-900">
                      {trucks.filter((t) => t.status === "in-transit").length}
                    </p>
                    <p className="text-xs text-green-600 mt-1">On schedule</p>
                  </div>
                  <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Delayed</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {trucks.filter((t) => t.status === "delayed").length}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">Needs attention</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Completed</p>
                    <p className="text-2xl font-bold text-emerald-900">
                      {shipments.filter((s) => s.status === "delivered").length}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">With receipts</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Smart Contract SLA Compliance Dashboard */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm mb-6">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Smart Contract SLA Monitor</h3>
                    <p className="text-sm text-blue-700">Automated blockchain enforcement</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const allTrucks = trucks.map(truck => evaluateSLA(truck, 'truck'));
                    const allShipments = shipments.map(shipment => evaluateSLA(shipment, 'shipment'));
                    const totalCompliant = [...allTrucks, ...allShipments].filter(sla => sla.compliant).length;
                    const totalItems = allTrucks.length + allShipments.length;
                    const complianceRate = Math.round((totalCompliant / totalItems) * 100);
                    const totalViolations = [...allTrucks, ...allShipments].reduce((sum, sla) => sum + sla.violations.length, 0);
                    return (<>
                      <div className="text-center p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                        <div className="text-xl font-bold text-blue-900">{complianceRate}%</div>
                        <div className="text-xs text-blue-700">SLA Compliance</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                        <div className="text-xl font-bold text-blue-900">{totalViolations}</div>
                        <div className="text-xs text-blue-700">Active Violations</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                        <div className="text-xl font-bold text-green-600">✓</div>
                        <div className="text-xs text-blue-700">Auto-Enforced</div>
                      </div>
                    </>);
                  })()}
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 text-sm text-blue-800">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Hyperledger Fabric:</span>
                  <span>All SLA rules automatically enforced without manual intervention</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Navigation className="w-5 h-5 mr-2 text-blue-600" />
                  <span className="text-gray-900">Live Fleet Tracking Map</span>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="border-blue-200 bg-transparent hover:bg-blue-50 hover:border-blue-300 transition-colors">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 border-blue-200 hover:border-blue-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trucks</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="loading">Loading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {/* Real Interactive Map for Fleet Tracking */}
              <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
                <FleetMapDynamic trucks={trucks} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trucks" className="mt-6">
          {/* Advanced Filters and Search */}
          <Card className="mb-4 bg-white border-blue-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search by truck ID, driver name..." className="pl-10 border-blue-200 hover:border-blue-300 focus:border-blue-400 transition-colors" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 border-blue-200 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eta">ETA</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="driver">Driver Name</SelectItem>
                    <SelectItem value="fuel">Fuel Level</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 border-blue-200 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="loading">Loading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-gray-600">
                Showing {filteredTrucks.length} of {trucks.length} trucks
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {filteredTrucks.map((truck) => (<Card key={truck.id} className="bg-white border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <Collapsible open={expandedTruck === truck.id} onOpenChange={() => setExpandedTruck(expandedTruck === truck.id ? null : truck.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center text-gray-900">
                            {truck.id}
                            {truck.priority === "high" && (<div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>)}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {truck.driver} • {truck.route}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{truck.eta}</div>
                          <div className="text-xs text-gray-500">{truck.location.address}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(truck.status)} border text-xs`}>{truck.status}</Badge>
                          <Badge className={`${getPriorityColor(truck.priority)} border text-xs`}>{truck.priority}</Badge>
                          {(() => {
                            const slaData = evaluateSLA(truck, 'truck');
                            return (<Badge className={`${getSLAStatusColor(slaData)} border cursor-pointer hover:opacity-80 transition-opacity`} onClick={() => setExpandedSLA(expandedSLA === `truck-${truck.id}` ? null : `truck-${truck.id}`)}>
                              <FileText className="w-3 h-3 mr-1" />
                              {slaData.compliant ? 'SLA Compliant' : 'SLA Breach Detected'}
                            </Badge>);
                          })()}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Badge className="bg-green-50 text-green-700 border-green-200 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => openAuditModal(truck, 'truck')}>
                                <Shield className="w-3 h-3 mr-1" />
                                Blockchain Verified
                              </Badge>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                        {expandedTruck === truck.id ? (<ChevronUp className="w-5 h-5 text-gray-400" />) : (<ChevronDown className="w-5 h-5 text-gray-400" />)}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-6 space-y-6">
                    {/* Smart Contract SLA Evaluation */}
                    {expandedSLA === `truck-${truck.id}` && (<div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                      {(() => {
                        const slaData = evaluateSLA(truck, 'truck');
                        return (<div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-blue-900 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              Smart Contract SLA Status
                            </h4>
                            <Badge className={`${getSLAStatusColor(slaData)} border`}>
                              {slaData.compliant ? (<><CheckCircle className="w-3 h-3 mr-1" />Compliant</>) : (<><AlertCircle className="w-3 h-3 mr-1" />Violations Detected</>)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-700">Contract Address:</span>
                                <span className="font-mono text-xs bg-white px-2 py-1 rounded">{slaData.smartContractAddress}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Last Evaluation:</span>
                                <span className="font-medium">{new Date(slaData.lastEvaluated).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Evaluation Tx:</span>
                                <span className="font-mono text-xs bg-white px-2 py-1 rounded">{slaData.evaluationTx}</span>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-700">Total Violations:</span>
                                <span className="font-bold text-blue-900">{slaData.violations.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Auto-Enforcement:</span>
                                <span className="font-medium text-green-600">✓ Enabled</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Tamper Proof:</span>
                                <span className="font-medium text-green-600">✓ Blockchain Secured</span>
                              </div>
                            </div>
                          </div>

                          {slaData.violations.length > 0 && (<div>
                            <h5 className="font-medium text-blue-900 mb-3 flex items-center">
                              <Zap className="w-4 h-4 mr-2" />
                              On-Chain Logic Triggers
                            </h5>
                            <div className="space-y-3">
                              {slaData.violations.map((violation, index) => (<div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <AlertCircle className={`w-4 h-4 ${violation.severity === 'critical' ? 'text-red-600' :
                                      violation.severity === 'high' ? 'text-red-500' :
                                        violation.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                                    <span className="font-medium text-gray-900">{violation.type.replace(/_/g, ' ')}</span>
                                  </div>
                                  <Badge className={`text-xs ${violation.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                    violation.severity === 'high' ? 'bg-red-50 text-red-600' :
                                      violation.severity === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {violation.severity}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{violation.message}</p>
                                <div className="bg-gray-50 rounded p-2 mb-2">
                                  <span className="text-xs text-gray-500">Smart Contract Rule:</span>
                                  <p className="text-xs font-mono text-gray-700">{violation.contractRule}</p>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Triggered: {new Date(violation.timestamp).toLocaleString()}</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Tx: {violation.blockchainTx}</span>
                                </div>
                              </div>))}
                            </div>
                          </div>)}
                        </div>);
                      })()}
                    </div>)}

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{truck.fuelLevel}%</div>
                        <div className="text-sm text-blue-700">Fuel Level</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{truck.performance.onTimeDeliveries}%</div>
                        <div className="text-sm text-green-700">On-Time Rate</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{truck.performance.safetyScore}%</div>
                        <div className="text-sm text-purple-700">Safety Score</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{truck.performance.fuelEfficiency}</div>
                        <div className="text-sm text-orange-700">Fuel Efficiency</div>
                      </div>
                    </div>

                    {/* Route History */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Route Progress</h4>
                      <div className="space-y-2">
                        {truck.routeHistory.map((stop, index) => (<div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${stop.status === "completed"
                            ? "bg-green-500"
                            : stop.status === "current"
                              ? "bg-blue-500 animate-pulse"
                              : stop.status === "delayed"
                                ? "bg-red-500"
                                : "bg-gray-300"}`}></div>
                          <span className="text-sm font-medium text-gray-900">{stop.time}</span>
                          <span className="text-sm text-gray-600 flex-1">{stop.location}</span>
                          <Badge className={`text-xs ${stop.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : stop.status === "current"
                              ? "bg-blue-50 text-blue-700"
                              : stop.status === "delayed"
                                ? "bg-red-50 text-red-700"
                                : "bg-gray-50 text-gray-700"}`}>
                            {stop.status}
                          </Badge>
                        </div>))}
                      </div>
                    </div>

                    {/* Vehicle & Cargo Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Vehicle Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mileage:</span>
                            <span className="font-medium text-gray-900">{truck.mileage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Maintenance:</span>
                            <span className="font-medium text-gray-900">{truck.lastMaintenance}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Next Maintenance:</span>
                            <span className="font-medium text-gray-900">{truck.nextMaintenance}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium text-gray-900">{truck.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Cargo Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cargo Type:</span>
                            <span className="font-medium text-gray-900">{truck.cargo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Temperature:</span>
                            <span className="font-medium text-gray-900">{truck.temperature}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Type:</span>
                            <span className="font-medium text-gray-900">{truck.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average Delivery Time:</span>
                            <span className="font-medium text-gray-900">{truck.performance.avgDeliveryTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {truck.alerts.length > 0 && (<div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-2 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Active Alert</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">{truck.alerts[0].message}</p>
                    </div>)}

                    <div className="flex space-x-2 pt-3 border-t border-gray-100">
                      <Button size="sm" variant="outline" className="border-blue-200 bg-transparent hover:bg-blue-50 hover:border-blue-300 transition-colors">
                        <Navigation className="w-3 h-3 mr-1" />
                        Track
                      </Button>
                      <Button size="sm" variant="outline" className="border-yellow-200 bg-transparent hover:bg-yellow-50 hover:border-yellow-300 transition-colors">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reroute
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                        <Phone className="w-3 h-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>))}
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="mt-6">
          {/* Delivery Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Delivered Today</p>
                    <p className="text-2xl font-bold text-green-900">{shipments.filter(s => s.status === 'delivered').length}</p>
                  </div>
                  <FileCheck className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">In Transit</p>
                    <p className="text-2xl font-bold text-blue-900">{shipments.filter(s => s.status === 'in-transit').length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Blockchain Receipts</p>
                    <p className="text-2xl font-bold text-purple-900">{shipments.filter(s => s.deliveryProof).length}</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Avg Quality Score</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {(() => {
                        const deliveredShipments = shipments.filter(s => s.deliveryProof);
                        if (deliveredShipments.length === 0)
                          return 0;
                        const totalScore = deliveredShipments.reduce((sum, s) => sum + (s.deliveryProof?.qualityScore || 0), 0);
                        return Math.round(totalScore / deliveredShipments.length);
                      })()}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Shipment Search */}
          <Card className="mb-4 bg-white border-green-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search by shipment ID, tracking number, or QR code..." className="pl-10 border-green-200 hover:border-green-300 focus:border-green-400 transition-colors" />
                </div>
                <Button variant="outline" className="border-green-200 bg-transparent hover:bg-green-50 hover:border-green-300 transition-colors">
                  <QrCode className="w-3 h-3 mr-1" />
                  Scan
                </Button>
                <Button variant="outline" className="border-blue-200 bg-transparent hover:bg-blue-50 hover:border-blue-300 transition-colors">
                  <Filter className="w-3 h-3 mr-1" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {shipments.map((shipment) => (<Card key={shipment.id} className="bg-white border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <Collapsible open={expandedShipment === shipment.id} onOpenChange={() => setExpandedShipment(expandedShipment === shipment.id ? null : shipment.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="border-b border-gray-100 cursor-pointer hover:bg-green-50 transition-colors p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900 flex items-center">
                            Shipment {shipment.id}
                            {shipment.status === 'delivered' && (<Badge className="ml-2 bg-green-100 text-green-700 border-green-200 text-xs">
                              <FileCheck className="w-3 h-3 mr-1" />
                              DELIVERED
                            </Badge>)}
                            <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0 hover:bg-blue-50" title="View QR Code">
                              <QrCode className="w-3 h-3" />
                            </Button>
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {shipment.origin} → {shipment.destination}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Tracking: {shipment.trackingNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">ETA: {shipment.eta}</div>
                          <div className="text-xs text-gray-500">Truck: {shipment.truck}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(shipment.status)} border`}>{shipment.status}</Badge>
                          {(() => {
                            const slaData = evaluateSLA(shipment, 'shipment');
                            return (<Badge className={`${getSLAStatusColor(slaData)} border cursor-pointer hover:opacity-80 transition-opacity`} onClick={() => setExpandedSLA(expandedSLA === `shipment-${shipment.id}` ? null : `shipment-${shipment.id}`)}>
                              <FileText className="w-3 h-3 mr-1" />
                              {slaData.compliant ? 'SLA Compliant' : 'SLA Breach Detected'}
                            </Badge>);
                          })()}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Badge className="bg-green-50 text-green-700 border-green-200 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => openAuditModal(shipment, 'shipment')}>
                                <Shield className="w-3 h-3 mr-1" />
                                Blockchain Verified
                              </Badge>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                        {expandedShipment === shipment.id ? (<ChevronUp className="w-5 h-5 text-gray-400" />) : (<ChevronDown className="w-5 h-5 text-gray-400" />)}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-6 space-y-6">
                    {/* Smart Contract SLA Evaluation for Shipments */}
                    {expandedSLA === `shipment-${shipment.id}` && (<div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-6">
                      {(() => {
                        const slaData = evaluateSLA(shipment, 'shipment');
                        return (<div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-purple-900 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              Smart Contract SLA Status
                            </h4>
                            <Badge className={`${getSLAStatusColor(slaData)} border`}>
                              {slaData.compliant ? (<><CheckCircle className="w-3 h-3 mr-1" />Compliant</>) : (<><AlertCircle className="w-3 h-3 mr-1" />Violations Detected</>)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-purple-700">Contract Address:</span>
                                <span className="font-mono text-xs bg-white px-2 py-1 rounded">{slaData.smartContractAddress}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-700">Last Evaluation:</span>
                                <span className="font-medium">{new Date(slaData.lastEvaluated).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-700">Evaluation Tx:</span>
                                <span className="font-mono text-xs bg-white px-2 py-1 rounded">{slaData.evaluationTx}</span>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-purple-700">Total Violations:</span>
                                <span className="font-bold text-purple-900">{slaData.violations.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-700">Auto-Penalties:</span>
                                <span className="font-medium text-green-600">✓ Enforced</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-purple-700">Immutable Rules:</span>
                                <span className="font-medium text-green-600">✓ Blockchain Secured</span>
                              </div>
                            </div>
                          </div>

                          {slaData.violations.length > 0 && (<div>
                            <h5 className="font-medium text-purple-900 mb-3 flex items-center">
                              <Zap className="w-4 h-4 mr-2" />
                              Automated Enforcement Triggers
                            </h5>
                            <div className="space-y-3">
                              {slaData.violations.map((violation, index) => (<div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <AlertCircle className={`w-4 h-4 ${violation.severity === 'critical' ? 'text-red-600' :
                                      violation.severity === 'high' ? 'text-red-500' :
                                        violation.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                                    <span className="font-medium text-gray-900">{violation.type.replace(/_/g, ' ')}</span>
                                  </div>
                                  <Badge className={`text-xs ${violation.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                    violation.severity === 'high' ? 'bg-red-50 text-red-600' :
                                      violation.severity === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {violation.severity}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{violation.message}</p>
                                <div className="bg-gray-50 rounded p-2 mb-2">
                                  <span className="text-xs text-gray-500">Smart Contract Logic:</span>
                                  <p className="text-xs font-mono text-gray-700">{violation.contractRule}</p>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Auto-Triggered: {new Date(violation.timestamp).toLocaleString()}</span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Tx: {violation.blockchainTx}</span>
                                </div>
                              </div>))}
                            </div>
                          </div>)}

                          {slaData.compliant && (<div className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <div className="flex items-center space-x-2 text-green-800">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-semibold">All SLA Requirements Met</span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">
                              This shipment is meeting all contractual obligations. Smart contract continuously monitors delivery windows,
                              temperature thresholds, and quality parameters without manual intervention.
                            </p>
                          </div>)}
                        </div>);
                      })()}
                    </div>)}

                    {/* Shipment Progress Timeline */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Shipment Progress</h4>
                      <div className="space-y-3">
                        {shipment.milestones.map((milestone, index) => (<div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-4 h-4 rounded-full flex-shrink-0 ${milestone.status === "completed"
                            ? "bg-green-500"
                            : milestone.status === "current"
                              ? "bg-blue-500 animate-pulse"
                              : milestone.status === "delayed"
                                ? "bg-red-500"
                                : "bg-gray-300"}`}></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{milestone.location}</span>
                              <span className="text-sm text-gray-500">{milestone.time}</span>
                            </div>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                          </div>
                          <Badge className={`text-xs ${milestone.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : milestone.status === "current"
                              ? "bg-blue-50 text-blue-700"
                              : milestone.status === "delayed"
                                ? "bg-red-50 text-red-700"
                                : "bg-gray-50 text-gray-700"}`}>
                            {milestone.status}
                          </Badge>
                        </div>))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Products</span>
                        <div className="space-y-2 mt-2">
                          {shipment.products.map((product, index) => (<div key={index} className="text-sm p-3 bg-gray-50 rounded-lg">
                            <div className="font-semibold text-gray-900 flex items-center justify-between">
                              {product.name}
                              <span className="text-xs text-green-600">{product.freshness}%</span>
                            </div>
                            <div className="text-gray-600">
                              {product.quantity} • SKU: {product.sku}
                            </div>
                          </div>))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Environmental Conditions</span>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <span className="text-sm text-blue-700">Temperature</span>
                            <span className="font-medium text-blue-900">{shipment.temperature}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <span className="text-sm text-blue-700">Humidity</span>
                            <span className="font-medium text-blue-900">{shipment.humidity}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm text-green-700">Dispatch Freshness</span>
                            <span className="font-medium text-green-800">{shipment.dispatchFreshness}%</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm text-green-700">Expected Freshness</span>
                            <span className="font-medium text-green-800">{shipment.expectedFreshness}%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Shipment Details</span>
                        <div className="space-y-2 mt-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Weight:</span>
                            <span className="font-medium text-gray-900">{shipment.details.totalWeight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Value:</span>
                            <span className="font-medium text-gray-900">{shipment.details.totalValue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Driver:</span>
                            <span className="font-medium text-gray-900">{shipment.details.driver}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle Type:</span>
                            <span className="font-medium text-gray-900">{shipment.details.vehicleType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Insurance:</span>
                            <span className="font-medium text-gray-900">{shipment.details.insurance}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Proof of Delivery Section for Delivered Shipments */}
                    {shipment.status === 'delivered' && shipment.deliveryProof && (<div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-green-900 flex items-center">
                          <FileCheck className="w-4 h-4 mr-2" />
                          Proof of Delivery - Blockchain Verified
                        </h4>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          DELIVERED
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">Delivery Time</span>
                          </div>
                          <div className="text-sm space-y-1">
                            <div><span className="text-gray-600">Scheduled:</span> {shipment.estimatedArrival}</div>
                            <div><span className="text-gray-600">Actual:</span> {shipment.actualDelivery}</div>
                            <div className="text-green-600 font-medium">✓ On Time</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">Received By</span>
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="font-medium">{shipment.deliveryProof.receivedBy}</div>
                            <div className="text-gray-600">{shipment.deliveryProof.receiverTitle}</div>
                            <div className="text-green-600 font-medium">✓ Signature Verified</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Thermometer className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">Condition Report</span>
                          </div>
                          <div className="text-sm space-y-1">
                            <div><span className="text-gray-600">Quality:</span> {shipment.deliveryProof.qualityScore}/100</div>
                            <div><span className="text-gray-600">Temperature:</span> {shipment.deliveryProof.temperatureAtDelivery}</div>
                            <div className="text-green-600 font-medium">✓ Excellent Condition</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-green-200 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Blockchain Verification</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-gray-600">Transaction Hash:</span>
                            <div className="font-mono bg-gray-50 p-1 rounded mt-1 break-all">
                              {shipment.deliveryProof.blockchainTx}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Block Number:</span>
                            <div className="font-medium mt-1">{shipment.deliveryProof.blockNumber}</div>
                            <span className="text-green-600">✓ {shipment.deliveryProof.networkValidation.verifyingPeers.length} Peers Verified</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white transition-colors" onClick={() => openProofOfDeliveryModal(shipment)}>
                          <FileCheck className="w-3 h-3 mr-1" />
                          View Receipt
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-colors" onClick={() => {
                          const proofData = generateProofOfDelivery(shipment);
                          if (proofData)
                            downloadBlockchainPDF(proofData);
                        }}>
                          <Download className="w-3 h-3 mr-1" />
                          Download PDF Receipt
                        </Button>
                      </div>
                    </div>)}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          {/* Active Alerts */}
          <Card className="bg-white border-red-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-gray-900">Active Alerts</span>
                <Button variant="outline" size="sm" className="border-red-200 bg-transparent hover:bg-red-50 hover:border-red-300 transition-colors">
                  <Filter className="w-3 h-3 mr-1" />
                  Filter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-4">
                {alerts.map((alert) => (<Card key={alert.id} className="border-red-200 shadow-sm hover:shadow-md transition-shadow">
                  <Collapsible open={expandedAlert === alert.id} onOpenChange={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-red-50 transition-colors p-4">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${alert.severity === 'high' ? 'bg-red-100' :
                              alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                              <AlertTriangle className={`w-5 h-5 ${alert.severity === 'high' ? 'text-red-600' :
                                alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">Alert {alert.id}</h3>
                                <Badge className={`${getSeverityColor(alert.severity)} border text-xs`}>
                                  {alert.severity}
                                </Badge>
                                {alert.actionRequired && (<Badge className="bg-red-600 text-white text-xs">Action Required</Badge>)}
                                {alert.type === 'sla_breach' && (<Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                  <FileText className="w-3 h-3 mr-1" />
                                  Smart Contract Enforced
                                </Badge>)}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {alert.message}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {alert.time}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {alert.location}
                                </span>
                                <span className="flex items-center">
                                  <Truck className="w-3 h-3 mr-1" />
                                  {alert.truck}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-3">
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">{alert.estimatedLoss}</div>
                              <div className="text-xs text-gray-500">Est. Loss</div>
                            </div>
                            <div className="flex items-center">
                              {expandedAlert === alert.id ? (<ChevronUp className="w-4 h-4 text-gray-400" />) : (<ChevronDown className="w-4 h-4 text-gray-400" />)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="p-4 pt-0 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Alert Details</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Type:</span>
                                <span className="font-medium text-gray-900 capitalize">{alert.type}</span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Severity:</span>
                                <Badge className={`${getSeverityColor(alert.severity)} border text-xs`}>
                                  {alert.severity}
                                </Badge>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600 mb-2">Affected Products:</div>
                                <div className="flex flex-wrap gap-1">
                                  {alert.affectedProducts.map((product, index) => (<Badge key={index} variant="secondary" className="text-xs">
                                    {product}
                                  </Badge>))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                                <span className="text-sm text-red-700">Estimated Loss:</span>
                                <span className="font-bold text-red-900">{alert.estimatedLoss}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Action Required</h4>
                            <div className="space-y-2">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <div className="text-sm text-blue-700 mb-1">Recommended Action:</div>
                                <div className="text-sm font-medium text-blue-900">{alert.recommendedAction}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm text-gray-600">Truck ID:</span>
                                  <span className="font-medium text-gray-900">{alert.truck}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm text-gray-600">Alert Time:</span>
                                  <span className="font-medium text-gray-900">{alert.time}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm text-gray-600">Current Location:</span>
                                  <span className="font-medium text-gray-900">{alert.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Smart Contract SLA Enforcement Display */}
                        {alert.type === 'sla_breach' && alert.smartContract && (<div className="mt-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-600" />
                            Smart Contract SLA Enforcement
                          </h4>
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Zap className="w-4 h-4 text-blue-600" />
                                  <span className="font-semibold text-blue-900">Automated Enforcement Active</span>
                                  <Badge className="bg-green-100 text-green-700 text-xs">VERIFIED</Badge>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-blue-700">Contract Address:</span>
                                    <span className="font-mono text-xs bg-white px-2 py-1 rounded">{alert.smartContract.contractAddress}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-blue-700">Block Number:</span>
                                    <span className="font-medium">{alert.smartContract.blockNumber}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-blue-700">Gas Used:</span>
                                    <span className="font-medium">{alert.smartContract.gasUsed}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-blue-700">Triggered:</span>
                                    <span className="font-medium">{new Date(alert.smartContract.timestamp).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2 mb-3">
                                  <Shield className="w-4 h-4 text-blue-600" />
                                  <span className="font-semibold text-blue-900">Network Verification</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div><span className="text-blue-700">Verifying Peers:</span></div>
                                  {alert.smartContract.verifyingPeers.map((peer, index) => (<div key={index} className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span className="text-xs font-mono bg-white px-2 py-1 rounded">{peer}</span>
                                  </div>))}
                                </div>
                              </div>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
                              <div className="text-sm text-gray-600 mb-2">Smart Contract Rule (Immutable):</div>
                              <code className="text-xs font-mono text-gray-800 bg-gray-50 p-2 rounded block">
                                {alert.smartContract.rule}
                              </code>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-blue-700">Transaction Hash:</span>
                              <span className="font-mono bg-white px-2 py-1 rounded break-all">{alert.smartContract.transactionHash}</span>
                            </div>
                          </div>
                        </div>)}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-blue-200 bg-transparent hover:bg-blue-50 hover:border-blue-300 transition-colors">
                              <Navigation className="w-3 h-3 mr-1" />
                              Track
                            </Button>
                            <Button size="sm" variant="outline" className="border-yellow-200 bg-transparent hover:bg-yellow-50 hover:border-yellow-300 transition-colors">
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Reroute
                            </Button>
                          </div>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white transition-colors">
                            <XCircle className="w-3 h-3 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Blockchain Audit Trail Modal */}
      <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Blockchain Audit Trail</span>
            </DialogTitle>
          </DialogHeader>

          {selectedAuditItem && (<div className="space-y-6">
            {/* Header Information */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Entity Information</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Type:</span> {selectedAuditItem.entityType}</div>
                    <div><span className="font-medium">ID:</span> {selectedAuditItem.entityId}</div>
                    {selectedAuditItem.trackingNumber && (<div><span className="font-medium">Tracking:</span> {selectedAuditItem.trackingNumber}</div>)}
                    {selectedAuditItem.driver && (<div><span className="font-medium">Driver:</span> {selectedAuditItem.driver}</div>)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Blockchain Network</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Network:</span> {selectedAuditItem.blockchainNetwork}</div>
                    <div><span className="font-medium">Channel:</span> {selectedAuditItem.channelId}</div>
                    <div><span className="font-medium">Contract:</span> {selectedAuditItem.contractName}</div>
                    <div><span className="font-medium">Verified:</span> {new Date(selectedAuditItem.verificationTimestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Clock4 className="w-4 h-4 mr-2" />
                Immutable Audit Trail
              </h3>
              <div className="space-y-4">
                {selectedAuditItem.auditTrail.map((entry, index) => (<div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{entry.checkpoint}</h4>
                        <p className="text-sm text-gray-600">{new Date(entry.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      {entry.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Blockchain Details</h5>
                      <div className="space-y-1 text-gray-600">
                        <div><span className="font-medium">Verifying Peer:</span> {entry.verifyingPeer}</div>
                        <div className="flex items-start space-x-2">
                          <span className="font-medium">Transaction Hash:</span>
                          <span className="break-all font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {entry.transactionHash}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Recorded Data</h5>
                      <div className="space-y-1 text-gray-600">
                        {Object.entries(entry.data).map(([key, value]) => (<div key={key}>
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}
                        </div>))}
                      </div>
                    </div>
                  </div>
                </div>))}
              </div>
            </div>

          </div>)}
        </DialogContent>
      </Dialog>

      {/* Proof of Delivery Modal */}
      <Dialog open={isProofModalOpen} onOpenChange={setIsProofModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-green-600" />
              <span>Blockchain-Verified Proof of Delivery</span>
            </DialogTitle>
          </DialogHeader>

          {selectedProofOfDelivery && (<div className="space-y-6">
            {/* Header Information */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Delivery Confirmation</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Shipment ID:</span> {selectedProofOfDelivery.shipmentId}</div>
                    <div><span className="font-medium">Tracking:</span> {selectedProofOfDelivery.trackingNumber}</div>
                    <div><span className="font-medium">Route:</span> {selectedProofOfDelivery.deliveryDetails.origin} → {selectedProofOfDelivery.deliveryDetails.destination}</div>
                    <div><span className="font-medium">Driver:</span> {selectedProofOfDelivery.deliveryDetails.driver}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Delivery Status</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Status:</span> <Badge className="bg-green-100 text-green-700 ml-1">DELIVERED</Badge></div>
                    <div><span className="font-medium">Delivered:</span> {new Date(selectedProofOfDelivery.deliveryDetails.deliveredAt).toLocaleString()}</div>
                    <div><span className="font-medium">Total Value:</span> {selectedProofOfDelivery.totalValue}</div>
                    <div><span className="font-medium">Total Weight:</span> {selectedProofOfDelivery.totalWeight}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Receiver Information */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Receiver Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedProofOfDelivery.receiverInfo.name}</div>
                  <div><span className="font-medium">Title:</span> {selectedProofOfDelivery.receiverInfo.title}</div>
                  <div><span className="font-medium">Received At:</span> {new Date(selectedProofOfDelivery.receiverInfo.receivedAt).toLocaleString()}</div>
                  <div className="mt-3">
                    <span className="font-medium text-blue-800">Digital Signature:</span>
                    <div className="bg-white rounded border p-2 mt-1">
                      <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                        [Digital Signature Verified ✓]
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Condition Report */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Thermometer className="w-4 h-4 mr-2" />
                  Condition Report
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Overall Condition:</span></div>
                  <div className="text-purple-800">{selectedProofOfDelivery.conditionReport.overallCondition}</div>
                  <div><span className="font-medium">Quality Score:</span>
                    <span className="ml-1 font-bold text-purple-900">{selectedProofOfDelivery.conditionReport.qualityScore}/100</span>
                  </div>
                  <div><span className="font-medium">Temperature:</span> {selectedProofOfDelivery.conditionReport.temperatureAtDelivery}</div>
                  <div className="mt-3">
                    <span className="font-medium text-purple-800">Photographic Evidence:</span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {selectedProofOfDelivery.conditionReport.photographicEvidence.map((photo, index) => (<div key={index} className="bg-white rounded border p-2">
                        <div className="h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                          Photo {index + 1} ✓
                        </div>
                      </div>))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Delivered */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Products Delivered
                </h4>
                <div className="space-y-2">
                  {selectedProofOfDelivery.products.map((product, index) => (<div key={index} className="bg-white rounded border p-2 text-sm">
                    <div className="font-medium text-orange-900">{product.name}</div>
                    <div className="text-orange-700">{product.quantity} • SKU: {product.sku}</div>
                    <div className="text-green-600 text-xs">Freshness: {product.freshness}% ✓</div>
                  </div>))}
                </div>
              </div>
            </div>

            {/* Blockchain Verification Section */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Hyperledger Fabric Verification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-indigo-800">Smart Contract:</span></div>
                  <div className="font-mono text-xs bg-white px-2 py-1 rounded border">
                    {selectedProofOfDelivery.blockchainVerification.smartContractAddress}
                  </div>
                  <div><span className="font-medium text-indigo-800">Channel:</span> {selectedProofOfDelivery.blockchainVerification.hyperledgerChannel}</div>
                  <div><span className="font-medium text-indigo-800">Block Number:</span> {selectedProofOfDelivery.blockchainVerification.blockNumber}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-indigo-800">Network Consensus:</span></div>
                  <div className="space-y-1">
                    {selectedProofOfDelivery.blockchainVerification.networkValidation.verifyingPeers.map((peer, index) => (<div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-mono bg-white px-2 py-1 rounded border">{peer}</span>
                    </div>))}
                  </div>
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-700">
                      {selectedProofOfDelivery.blockchainVerification.networkValidation.validationStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-white rounded border p-3">
                <div className="text-sm text-indigo-800 mb-2">Transaction Hash (Immutable Proof):</div>
                <div className="font-mono text-xs bg-gray-50 p-2 rounded break-all border">
                  {selectedProofOfDelivery.blockchainVerification.transactionHash}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => downloadBlockchainPDF(selectedProofOfDelivery)}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF Receipt
              </Button>
              <Button variant="outline" className="border-gray-300">
                <FileCheck className="w-4 h-4 mr-2" />
                Verify on Blockchain Explorer
              </Button>
              <Button variant="outline" className="border-gray-300">
                <User className="w-4 h-4 mr-2" />
                Send to Customer
              </Button>
            </div>

          </div>)}
        </DialogContent>
      </Dialog>
    </div>
  </div>);
}

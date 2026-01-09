import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UniversalHeader } from '@/components/universal-header';

// Lazy load pages
const LoginPage = React.lazy(() => import('@/app/page'));
const DashboardPage = React.lazy(() => import('@/app/dashboard/page'));
const AnalyticsPage = React.lazy(() => import('@/app/dashboard/analytics/page'));
const GodownPage = React.lazy(() => import('@/app/dashboard/godown/page'));
const CategoryDetailPage = React.lazy(() => import('@/app/dashboard/category/detail'));
const VendorPage = React.lazy(() => import('@/app/vendor/page'));
const CustomerPage = React.lazy(() => import('@/app/customer/page'));
const LogisticsPage = React.lazy(() => import('@/app/logistics/page'));
const ControlTowerPage = React.lazy(() => import('@/app/control-tower/page'));
const EventIntelligencePage = React.lazy(() => import('@/app/event-intelligence/page'));
const TrendIntelligencePage = React.lazy(() => import('@/app/trend-intelligence/page'));
const WeatherIntelligencePage = React.lazy(() => import('@/app/weather-intelligence/page'));
const ForecastEnginePage = React.lazy(() => import('@/app/forecast-engine/page'));
const ScenarioPlanningPage = React.lazy(() => import('@/app/scenario-planning/page'));







// Layout wrapper
const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <UniversalHeader />
            <main>
                {children}
            </main>
        </div>
    );
};

// Loading fallback
const Loading = () => <div className="flex items-center justify-center min-h-screen">Loading...</div>;

export default function App() {
    return (
        <Router>
            <Layout>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="/" element={<ControlTowerPage />} />
                        <Route path="/event-intelligence" element={<EventIntelligencePage />} />
                        <Route path="/trend-intelligence" element={<TrendIntelligencePage />} />
                        <Route path="/weather-intelligence" element={<WeatherIntelligencePage />} />
                        <Route path="/forecast-engine" element={<ForecastEnginePage />} />
                        <Route path="/scenario-planning" element={<ScenarioPlanningPage />} />
                        <Route path="/login" element={<LoginPage />} />






                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
                        <Route path="/dashboard/godown" element={<GodownPage />} />
                        <Route path="/dashboard/category/:categoryId" element={<CategoryDetailPage />} />
                        <Route path="/dashboard/*" element={<DashboardPage />} /> {/* Fallback for dashboard tabs */}

                        <Route path="/vendor" element={<VendorPage />} />
                        <Route path="/vendor/*" element={<VendorPage />} />

                        <Route path="/customer" element={<CustomerPage />} />
                        <Route path="/customer/*" element={<CustomerPage />} />

                        <Route path="/logistics" element={<LogisticsPage />} />
                        <Route path="/logistics/*" element={<LogisticsPage />} />
                    </Routes>
                </Suspense>
            </Layout>
        </Router>
    );
}

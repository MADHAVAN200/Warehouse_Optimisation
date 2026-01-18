-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. EVENT INTELLIGENCE TABLES
-- Stores city-level events (concerts, games, protests, holidays)
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  event_type text not null, -- e.g., 'Concert', 'Sports', 'Public Holiday', 'Protest'
  severity text check (severity in ('Low', 'Medium', 'High', 'Critical')),
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  city text not null,
  location_name text,
  impact_score integer check (impact_score >= 0 and impact_score <= 100), -- 0-100 score for normalization
  affected_categories text[], -- Array of categories e.g. ['Beverages', 'Traffic']
  status text default 'Active' -- 'Active', 'Cancelled', 'Past'
);

-- 2. WEATHER INTELLIGENCE TABLES
-- Stores daily weather forecasts for analysis
create table if not exists public.weather_forecasts (
  id uuid default uuid_generate_v4() primary key,
  city text not null,
  forecast_date date not null,
  temperature_min numeric,
  temperature_max numeric,
  humidity integer,
  precipitation_prob integer,
  condition text, -- e.g., 'Sunny', 'Rain', 'Storm'
  alert_level text check (alert_level in ('None', 'Advisory', 'High', 'Severe')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(city, forecast_date) -- Prevent duplicate forecasts for same city/day
);

-- 3. TREND INTELLIGENCE TABLES
-- Stores aggregated signal momentum for products/categories
create table if not exists public.trends (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  category text not null,
  region text not null,
  trend_score numeric check (trend_score >= 0 and trend_score <= 100),
  momentum text check (momentum in ('Rising', 'Falling', 'Stable', 'Volatile')),
  signal_strength text check (signal_strength in ('Weak', 'Moderate', 'Strong')), -- Confidence in the signal
  drivers jsonb, -- e.g., {"social_buzz": 0.4, "sales_velocity": 0.6}
  last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- 4. DEMAND FORECASTS (Output of the Engine)
-- Stores the final AI prediction to compare against actuals later
create table if not exists public.demand_forecasts (
  id uuid default uuid_generate_v4() primary key,
  sku text not null,
  forecast_date date not null,
  predicted_units numeric not null,
  confidence_lower numeric,
  confidence_upper numeric,
  scenario_type text default 'Base', -- 'Base', 'Event_High', 'Weather_Severe', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. RLS POLICIES (Example: Open access for prototype, restrict in production)
alter table public.events enable row level security;
alter table public.weather_forecasts enable row level security;
alter table public.trends enable row level security;
alter table public.demand_forecasts enable row level security;

-- Allow read access to all authenticated users
create policy "Enable read access for all users" on public.events for select using (true);
create policy "Enable read access for all users" on public.weather_forecasts for select using (true);
create policy "Enable read access for all users" on public.trends for select using (true);
create policy "Enable read access for all users" on public.demand_forecasts for select using (true);

-- Allow insert/update for service role or authenticated users (demo mode)
create policy "Enable insert for authenticated users" on public.events for insert with check (true);
create policy "Enable insert for authenticated users" on public.weather_forecasts for insert with check (true);
create policy "Enable insert for authenticated users" on public.trends for insert with check (true);
create policy "Enable insert for authenticated users" on public.demand_forecasts for insert with check (true);

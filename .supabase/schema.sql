-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  company TEXT DEFAULT '',
  value DECIMAL(10,2) DEFAULT 0,
  source TEXT DEFAULT 'Manual',
  notes TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'meeting', 'closed')),
  last_contact TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for leads table
CREATE POLICY "Users can view all leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Users can insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update leads" ON leads FOR UPDATE USING (true);
CREATE POLICY "Users can delete leads" ON leads FOR DELETE USING (true);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('meta', 'google', 'linkedin', 'shopify')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  spend DECIMAL(10,2) DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  roas DECIMAL(5,2) DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0,
  cpc DECIMAL(5,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);

-- Enable RLS for campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for campaigns
CREATE POLICY "Users can view all campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Users can insert campaigns" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update campaigns" ON campaigns FOR UPDATE USING (true);
CREATE POLICY "Users can delete campaigns" ON campaigns FOR DELETE USING (true);

-- Create automations table
CREATE TABLE IF NOT EXISTS automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('spend_limit', 'roas_drop', 'conversions_low', 'time_based')),
  trigger_conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  last_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for automations
CREATE INDEX IF NOT EXISTS idx_automations_enabled ON automations(enabled);
CREATE INDEX IF NOT EXISTS idx_automations_trigger_type ON automations(trigger_type);

-- Enable RLS for automations
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

-- Create policies for automations
CREATE POLICY "Users can view all automations" ON automations FOR SELECT USING (true);
CREATE POLICY "Users can insert automations" ON automations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update automations" ON automations FOR UPDATE USING (true);
CREATE POLICY "Users can delete automations" ON automations FOR DELETE USING (true);

-- Create automation_executions table
CREATE TABLE IF NOT EXISTS automation_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
  triggered BOOLEAN DEFAULT false,
  executed BOOLEAN DEFAULT false,
  message TEXT DEFAULT '',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for automation_executions
CREATE INDEX IF NOT EXISTS idx_automation_executions_automation_id ON automation_executions(automation_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_timestamp ON automation_executions(timestamp);

-- Enable RLS for automation_executions
ALTER TABLE automation_executions ENABLE ROW LEVEL SECURITY;

-- Create policies for automation_executions
CREATE POLICY "Users can view all automation_executions" ON automation_executions FOR SELECT USING (true);
CREATE POLICY "Users can insert automation_executions" ON automation_executions FOR INSERT WITH CHECK (true);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'weekly' CHECK (type IN ('daily', 'weekly', 'monthly')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'sent')),
  date_range_start TIMESTAMP WITH TIME ZONE,
  date_range_end TIMESTAMP WITH TIME ZONE,
  metrics JSONB DEFAULT '{}',
  file_url TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for reports
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON reports(generated_at);

-- Enable RLS for reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies for reports
CREATE POLICY "Users can view all reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Users can insert reports" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update reports" ON reports FOR UPDATE USING (true);
CREATE POLICY "Users can delete reports" ON reports FOR DELETE USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

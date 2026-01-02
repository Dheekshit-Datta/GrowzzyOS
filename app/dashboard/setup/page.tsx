'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, AlertCircle, Database, Key, Bot, FileText } from 'lucide-react';

interface SetupStatus {
  database: boolean;
  environment: boolean;
  ai: boolean;
  tables: boolean;
}

export default function SetupPage() {
  const [status, setStatus] = useState<SetupStatus>({
    database: false,
    environment: false,
    ai: false,
    tables: false
  });
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    setChecking(true);
    try {
      // Check database connection
      const dbResponse = await fetch('/api/setup');
      const dbData = await dbResponse.json();
      
      // Check environment variables
      const envResponse = await fetch('/api/setup?action=check-env');
      const envData = await envResponse.json();
      
      setStatus({
        database: !dbData.error,
        environment: Object.values(envData.env).every((v: any) => v === true),
        ai: envData.env.openai_key,
        tables: !dbData.error
      });
    } catch (error) {
      console.error('Setup check failed:', error);
      toast({ title: 'Failed to check setup status', variant: 'destructive' });
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const createSampleData = async () => {
    try {
      const response = await fetch('/api/setup');
      const data = await response.json();
      
      if (data.error) {
        toast({ title: 'Database setup failed', description: data.details, variant: 'destructive' });
      } else {
        toast({ title: 'Database setup successful', description: data.message });
        setStatus(prev => ({ ...prev, database: true, tables: true }));
      }
    } catch (error) {
      toast({ title: 'Setup failed', variant: 'destructive' });
    }
  };

  const StatusIcon = ({ checked }: { checked: boolean }) => (
    checked ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
  );

  if (loading) {
    return (
      <DashboardLayout activeTab="setup">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="setup">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Platform Setup</h1>
          <p className="text-muted-foreground">Configure your GrowzzyOS platform for full functionality</p>
        </div>

        {/* Setup Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Setup Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5" />
                <span>Database Connection</span>
              </div>
              <StatusIcon checked={status.database} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <span>Database Tables</span>
              </div>
              <StatusIcon checked={status.tables} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5" />
                <span>Environment Variables</span>
              </div>
              <StatusIcon checked={status.environment} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5" />
                <span>AI API Keys</span>
              </div>
              <StatusIcon checked={status.ai} />
            </div>
          </div>
        </Card>

        {/* Environment Variables Configuration */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supabase-url">Supabase URL</Label>
                <Input id="supabase-url" placeholder="NEXT_PUBLIC_SUPABASE_URL" />
              </div>
              <div>
                <Label htmlFor="supabase-key">Supabase Service Role Key</Label>
                <Input id="supabase-key" placeholder="SUPABASE_SERVICE_ROLE_KEY" />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input id="openai-key" placeholder="OPENAI_API_KEY" />
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold">Important:</p>
                  <p>Create a `.env.local` file in your project root and add these variables:</p>
                  <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded">
{`NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Database Setup */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Database Setup</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              If your Supabase database doesn't have the required tables, click below to create them and add sample data.
            </p>
            
            <Button 
              onClick={createSampleData}
              disabled={status.database || checking}
              className="w-full"
            >
              {checking ? 'Setting up...' : 'Create Database Tables & Sample Data'}
            </Button>
            
            {status.database && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">✅ Database is set up and ready!</p>
              </div>
            )}
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${status.database ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Configure environment variables in `.env.local`</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${status.database ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Set up Supabase database and tables</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${status.ai ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Configure OpenAI API key for AI Co-Pilot functionality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${status.database ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Test all features (Leads, Reports, Automations, Copilot)</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

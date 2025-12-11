import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BarChart2, 
  Zap, 
  Bot, 
  Settings, 
  Bell, 
  Search, 
  ChevronDown,
  Plus,
  MessageSquare,
  FileText,
  Users,
  PieChart,
  Mail,
  Calendar,
  FileBarChart2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

export function DashboardLayout({ children, activeTab = 'overview' }: DashboardLayoutProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="h-4 w-4" /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Zap className="h-4 w-4" /> },
    { id: 'copilot', label: 'AI Co-Pilot', icon: <Bot className="h-4 w-4" /> },
    { id: 'leads', label: 'Leads & CRM', icon: <Users className="h-4 w-4" /> },
    { id: 'content', label: 'Content Studio', icon: <FileText className="h-4 w-4" /> },
    { id: 'automations', label: 'Automations', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart2 className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold text-gray-900">
              GROWZZY OS
            </Link>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.id === 'overview' ? '/dashboard' : `/dashboard/${item.id}`}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 mt-auto">
              <Button className="w-full bg-black hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="md:hidden">
                <Button variant="ghost" size="icon">
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
              </div>
              <div className="ml-4 flex items-baseline">
                <h1 className="text-lg font-medium text-gray-900">
                  {navItems.find((item) => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">JD</span>
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">John Doe</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

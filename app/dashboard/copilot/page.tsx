'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockCampaigns } from '@/lib/mockData';
import { Send, Lightbulb, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI Marketing Co-Pilot. I can help you optimize campaigns, generate insights, and provide recommendations. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: string; title: string; description: string } | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: { campaigns: mockCampaigns },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'No response received',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration and try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationAction = (type: string, title: string, description: string) => {
    setPendingAction({ type, title, description });
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (!pendingAction) return;

    setActionLoading(pendingAction.type);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let successMessage = '';
      if (pendingAction.type === 'pause') {
        successMessage = '✅ Campaign paused successfully! Syncing to Meta Ads...';
      } else if (pendingAction.type === 'apply-budget') {
        successMessage = '✅ Budget updated! Increasing spend on high-performing campaign...';
      } else if (pendingAction.type === 'generate-copy') {
        successMessage = '✅ Generating new ad copy variants...';
      }

      // Add success message to chat
      const successMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: successMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMsg]);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  // AI Recommendations
  const recommendations = [
    {
      icon: TrendingDown,
      title: 'Pause Underperforming Ad Set',
      description: 'Shopify Flash Sale has ROAS of 2.0x, below your 2.5x target',
      action: 'Pause Campaign',
      actionType: 'pause',
      color: 'red',
    },
    {
      icon: AlertCircle,
      title: 'Budget Optimization',
      description: 'Shift ₹5,000 from Campaign A (1.2x ROAS) to Campaign B (2.0x ROAS)',
      action: 'Apply Suggestion',
      actionType: 'apply-budget',
      color: 'orange',
    },
    {
      icon: CheckCircle,
      title: 'Creative Refresh Needed',
      description: 'Black Friday Sale ad has 8 days age. Consider updating creative',
      action: 'Generate New Copy',
      actionType: 'generate-copy',
      color: 'blue',
    },
  ];

  return (
    <DashboardLayout activeTab="copilot">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Marketing Co-Pilot</h1>
          <p className="text-gray-600 mt-1">Get intelligent recommendations and insights powered by AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[600px] flex flex-col">
              <h2 className="text-xl font-bold mb-4">Chat with AI</h2>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <p className="text-sm text-gray-600">AI is thinking...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your campaigns..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Recommendations Sidebar */}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <h2 className="text-lg font-bold">AI Recommendations</h2>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec, idx) => {
                  const Icon = rec.icon;
                  return (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex gap-2 mb-2">
                        <Icon className={`h-4 w-4 text-${rec.color}-500 flex-shrink-0 mt-0.5`} />
                        <p className="font-semibold text-sm">{rec.title}</p>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{rec.description}</p>
                      <Button
                        onClick={() => handleRecommendationAction(rec.actionType, rec.title, rec.description)}
                        disabled={actionLoading === rec.actionType}
                        className="w-full bg-black hover:bg-gray-800 text-white text-xs py-1"
                      >
                        {actionLoading === rec.actionType ? 'Processing...' : rec.action}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Campaign Performance Audit */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Campaign Audit</h2>
              <div className="space-y-2">
                {mockCampaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="p-2 bg-gray-50 rounded">
                    <p className="text-sm font-semibold">{campaign.name}</p>
                    <p className="text-xs text-gray-600">
                      ROAS: {campaign.roas}x {campaign.roas < 2.5 ? '⚠️' : '✅'}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && pendingAction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-2">Confirm Action</h3>
              <p className="text-sm text-gray-600 mb-4">{pendingAction.description}</p>
              <p className="text-sm font-semibold mb-6">
                {pendingAction.type === 'pause' && '⏸️ This will pause the campaign immediately'}
                {pendingAction.type === 'apply-budget' && '💰 This will reallocate your budget'}
                {pendingAction.type === 'generate-copy' && '✍️ This will generate new ad copy variants'}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAction}
                  disabled={actionLoading !== null}
                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                >
                  {actionLoading ? 'Processing...' : 'Confirm & Apply'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

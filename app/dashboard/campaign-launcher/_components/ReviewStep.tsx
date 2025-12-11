'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, DollarSign, Users, Image as ImageIcon } from 'lucide-react';
import { useCampaignLauncher } from '../_context/CampaignLauncherContext';

type ReviewItem = {
  title: string;
  value: string | number | string[];
  icon: React.ReactNode;
  type?: 'list' | 'text' | 'chips';
};

export function ReviewStep() {
  const { data } = useCampaignLauncher();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewItems: ReviewItem[] = [
    {
      title: 'Campaign Goal',
      value: data.goal || 'Not specified',
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    },
    {
      title: 'Strategy',
      value: data.strategy || 'Not specified',
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
    {
      title: 'Daily Budget',
      value: data.dailyBudget ? `$${data.dailyBudget.toLocaleString()}` : 'Not specified',
      icon: <DollarSign className="h-5 w-5 text-yellow-500" />,
    },
    {
      title: 'Target Audiences',
      value: data.audiences.length > 0 ? data.audiences : ['No audiences selected'],
      icon: <Users className="h-5 w-5 text-purple-500" />,
      type: 'chips',
    },
    {
      title: 'Creatives',
      value: data.creatives.length > 0 ? data.creatives : ['No creatives selected'],
      icon: <ImageIcon className="h-5 w-5 text-pink-500" />,
      type: 'chips',
    },
  ];

  const handleSubmit = async () => {
    if (!data.goal || !data.strategy || !data.dailyBudget || data.audiences.length === 0 || data.creatives.length === 0) {
      setError('Please complete all steps before submitting');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, you would make an API call here
      console.log('Submitting campaign:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      // In a real app, you might use a toast notification here
      alert('Campaign created successfully!');
      
      // Redirect to campaigns list or dashboard
      router.push('/dashboard/campaigns');
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Review Your Campaign</h2>
        <p className="text-muted-foreground mt-2">
          Please review your campaign details before launching
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviewItems.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center space-x-4 space-y-0 pb-2">
              <div className="p-2 rounded-lg bg-opacity-10 bg-current">
                {item.icon}
              </div>
              <div>
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {item.type === 'chips' ? (
                <div className="flex flex-wrap gap-2">
                  {(item.value as string[]).map((value, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium">{item.value as string}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Campaign Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Estimated Daily Spend</h4>
              <p className="text-lg font-semibold">
                ${data.dailyBudget ? data.dailyBudget.toLocaleString() : '0'} / day
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Estimated Monthly Spend</h4>
              <p className="text-lg font-semibold">
                ${data.dailyBudget ? (data.dailyBudget * 30).toLocaleString() : '0'} / month
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Target Audience Size</h4>
              <p className="text-lg font-semibold">
                {data.audiences.length > 0 ? 'Custom Audience' : 'No audience selected'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Creatives</h4>
              <p className="text-lg font-semibold">
                {data.creatives.length} {data.creatives.length === 1 ? 'Creative' : 'Creatives'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? 'Launching Campaign...' : 'Launch Campaign'}
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Plus, X } from 'lucide-react';
// Import from the context file instead of page
import { useCampaignLauncher } from '../_context/CampaignLauncherContext';

type Audience = {
  id: string;
  name: string;
  size: string;
  interests: string[];
};

const mockAudiences: Audience[] = [
  {
    id: 'aud-1',
    name: 'Tech Enthusiasts',
    size: '1.2M',
    interests: ['Gadgets', 'AI', 'Programming']
  },
  {
    id: 'aud-2',
    name: 'Online Shoppers',
    size: '3.5M',
    interests: ['E-commerce', 'Deals', 'Fashion']
  },
  {
    id: 'aud-3',
    name: 'Fitness Lovers',
    size: '890K',
    interests: ['Workout', 'Nutrition', 'Wellness']
  },
  {
    id: 'aud-4',
    name: 'Business Professionals',
    size: '2.1M',
    interests: ['Networking', 'Leadership', 'Startups']
  },
];

export function AudienceStep() {
  const { data, update } = useCampaignLauncher();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAudienceForm, setShowNewAudienceForm] = useState(false);
  const [newAudienceName, setNewAudienceName] = useState('');
  const [newAudienceDescription, setNewAudienceDescription] = useState('');
  const [newAudienceInterests, setNewAudienceInterests] = useState('');
  
  const selectedAudiences = data.audiences || [];

  const filteredAudiences = mockAudiences.filter(audience =>
    audience.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audience.interests.some(interest => 
      interest.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleAudience = (audienceId: string) => {
    const newAudiences = selectedAudiences.includes(audienceId)
      ? selectedAudiences.filter((id: string) => id !== audienceId)
      : [...selectedAudiences, audienceId];
    update({ audiences: newAudiences });
  };

  const createNewAudience = () => {
    // In a real app, this would make an API call
    console.log('Creating new audience:', {
      name: newAudienceName,
      description: newAudienceDescription,
      interests: newAudienceInterests.split(',').map(s => s.trim())
    });
    
    // Reset form
    setNewAudienceName('');
    setNewAudienceDescription('');
    setNewAudienceInterests('');
    setShowNewAudienceForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Input
            type="text"
            placeholder="Search audiences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <Button 
          onClick={() => setShowNewAudienceForm(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Audience
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          onClick={() => {
            // In a real app, you might want to validate selection here
            console.log('Selected audiences:', selectedAudiences);
          }}
        >
          {selectedAudiences.length > 0 
            ? `Continue with ${selectedAudiences.length} Audience${selectedAudiences.length > 1 ? 's' : ''}`
            : 'Skip for Now'}
        </Button>
      </div>

      {showNewAudienceForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Audience Name</label>
              <Input 
                value={newAudienceName}
                onChange={(e) => setNewAudienceName(e.target.value)}
                placeholder="e.g., Tech Startup Founders"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                value={newAudienceDescription}
                onChange={(e) => setNewAudienceDescription(e.target.value)}
                placeholder="Describe this audience..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Interests (comma-separated)</label>
              <Input 
                value={newAudienceInterests}
                onChange={(e) => setNewAudienceInterests(e.target.value)}
                placeholder="e.g., technology, startups, saas"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowNewAudienceForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={createNewAudience}>
                Create Audience
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAudiences.map((audience) => (
          <Card 
            key={audience.id}
            className={`cursor-pointer transition-colors ${
              selectedAudiences.includes(audience.id) 
                ? 'border-blue-500 bg-blue-50' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => toggleAudience(audience.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{audience.name}</CardTitle>
                {selectedAudiences.includes(audience.id) && (
                  <div className="bg-blue-500 text-white p-1 rounded-full">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {audience.size} users
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {audience.interests.map((interest, i) => (
                  <span 
                    key={i} 
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAudiences.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h3 className="font-medium">{selectedAudiences.length} audience(s) selected</h3>
              <p className="text-sm text-gray-500">Click on an audience to select/deselect</p>
            </div>
            <Button>Continue with Selected Audiences</Button>
          </div>
        </div>
      )}
    </div>
  );
}

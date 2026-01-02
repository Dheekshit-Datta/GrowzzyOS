'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Plus, Image as ImageIcon, Video, FileText, X, Upload } from 'lucide-react';
import { useCampaignLauncher } from '../_context/CampaignLauncherContext';

type CreativeType = 'image' | 'video' | 'carousel' | 'story';

type CreativeAsset = {
  id: string;
  type: CreativeType;
  url: string;
  title: string;
  dimensions: string;
  size: string;
  lastUpdated: string;
};

const mockCreatives: CreativeAsset[] = [
  {
    id: 'creative-1',
    type: 'image',
    url: 'https://via.placeholder.com/800x600',
    title: 'Summer Sale Banner',
    dimensions: '1200x628',
    size: '1.2MB',
    lastUpdated: '2 days ago',
  },
  {
    id: 'creative-2',
    type: 'video',
    url: 'https://via.placeholder.com/800x450',
    title: 'Product Demo Video',
    dimensions: '1920x1080',
    size: '5.7MB',
    lastUpdated: '1 week ago',
  },
  {
    id: 'creative-3',
    type: 'carousel',
    url: 'https://via.placeholder.com/800x800',
    title: 'Product Collection',
    dimensions: '1080x1080',
    size: '3.1MB',
    lastUpdated: '3 days ago',
  },
  {
    id: 'creative-4',
    type: 'story',
    url: 'https://via.placeholder.com/1080x1920',
    title: 'Mobile Story Ad',
    dimensions: '1080x1920',
    size: '2.8MB',
    lastUpdated: '1 day ago',
  },
];

export function CreativeStep() {
  const { data, update } = useCampaignLauncher();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const selectedCreatives = data.creatives || [];

  const filteredCreatives = mockCreatives.filter(creative =>
    creative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creative.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCreative = (creativeId: string) => {
    const newCreatives = selectedCreatives.includes(creativeId)
      ? selectedCreatives.filter((id: string) => id !== creativeId)
      : [...selectedCreatives, creativeId];
    update({ creatives: newCreatives });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            // In a real app, you would add the uploaded file to your state/API here
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Reset file input
    e.target.value = '';
  };

  const getTypeIcon = (type: CreativeType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'carousel':
        return <div className="flex">
          <div className="h-5 w-3 bg-blue-400 mr-0.5"></div>
          <div className="h-5 w-3 bg-blue-300 mr-0.5"></div>
          <div className="h-5 w-3 bg-blue-200"></div>
        </div>;
      case 'story':
        return <div className="h-5 w-5 rounded-full bg-gradient-to-br from-pink-500 to-purple-600"></div>;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Input
            type="text"
            placeholder="Search creatives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => {
              // In a real app, you might want to validate selection here
              console.log('Selected creatives:', selectedCreatives);
            }}
          >
            {selectedCreatives.length > 0 
              ? `Use ${selectedCreatives.length} Creative${selectedCreatives.length > 1 ? 's' : ''}`
              : 'Skip for Now'}
          </Button>
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
        
        <div className="relative">
          <input
            type="file"
            id="creative-upload"
            className="hidden"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
          />
          <label
            htmlFor="creative-upload"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload New
          </label>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCreatives.map((creative) => (
          <Card 
            key={creative.id}
            className={`overflow-hidden transition-all ${
              selectedCreatives.includes(creative.id)
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:shadow-md'
            }`}
          >
            <div className="relative group">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={creative.url}
                  alt={creative.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCreative(creative.id);
                }}
                className={`absolute top-2 right-2 p-1.5 rounded-full ${
                  selectedCreatives.includes(creative.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/90 text-gray-400 hover:text-gray-600'
                }`}
              >
                {selectedCreatives.includes(creative.id) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            </div>
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-medium line-clamp-1">
                    {creative.title}
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    {creative.dimensions} • {creative.size}
                  </p>
                </div>
                {getTypeIcon(creative.type)}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedCreatives.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h3 className="font-medium">{selectedCreatives.length} creative(s) selected</h3>
              <p className="text-sm text-gray-500">Click on a creative to select/deselect</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelectedCreatives([])}>
                Clear Selection
              </Button>
              <Button>Use Selected Creatives</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

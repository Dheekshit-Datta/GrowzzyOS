'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockContentAssets } from '@/lib/mockData';
import { showToast } from '@/components/Toast';
import { Plus, Wand2, Copy, Trash2, Eye } from 'lucide-react';

export default function ContentStudioPage() {
  const [assets, setAssets] = useState(mockContentAssets);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<typeof mockContentAssets[0] | null>(null);

  const [variants, setVariants] = useState<Array<{id: string; text: string; imageUrl: string}>>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const [genLoading, setGenLoading] = useState(false);
  const [form, setForm] = useState({ product: '', benefit: '', audience: '', tone: 'Professional' });

  const generateCopy = async () => {
    if (!form.product || !form.benefit || !form.audience) {
      showToast('Please fill all fields', 'error');
      return;
    }
    setGenLoading(true);
    setImageLoading({});
    showToast('Generating content and images...', 'info', 0);
    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setVariants(data.variants || []);
      setCurrentIdx(0);
      showToast('Content and images generated!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate content', 'error');
    } finally {
      setGenLoading(false);
    }
  };

  const regenerateImage = async (variantId: string) => {
    if (!form.product || !variants[currentIdx]?.text) return;
    
    setImageLoading(prev => ({ ...prev, [variantId]: true }));
    
    try {
      const res = await fetch('/api/content/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: form.product,
          adCopy: variants[currentIdx].text
        }),
      });
      
      if (!res.ok) throw new Error('Failed to regenerate image');
      
      const { imageUrl } = await res.json();
      
      setVariants(prev => 
        prev.map(v => 
          v.id === variantId 
            ? { ...v, imageUrl } 
            : v
        )
      );
      
      showToast('Image regenerated!', 'success');
    } catch (err) {
      console.error('Error regenerating image:', err);
      showToast('Failed to regenerate image', 'error');
    } finally {
      setImageLoading(prev => ({ ...prev, [variantId]: false }));
    }
  };
  
  const downloadImage = (imageUrl: string, variantId: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ad-image-${variantId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Image downloaded!', 'success');
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  return (
    <DashboardLayout activeTab="content">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Content & Ad Creative Generator</h1>
            <p className="text-gray-600 mt-1">Generate high-converting ad copy and creative briefs with AI</p>
          </div>
          <Button
            onClick={() => setShowGenerator(true)}
            className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Generate Content
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Assets</p>
            <p className="text-3xl font-bold mt-2">{assets.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Published</p>
            <p className="text-3xl font-bold mt-2">{assets.filter((a) => a.status === 'published').length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Reach</p>
            <p className="text-3xl font-bold mt-2">{(assets.reduce((sum, a) => sum + a.performance.reach, 0) / 1000).toFixed(0)}K</p>
          </Card>
        </div>

        {/* Content Assets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <Card key={asset.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase">{asset.type.replace('_', ' ')}</p>
                  <h3 className="font-bold text-sm mt-1">{asset.title}</h3>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    asset.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : asset.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {asset.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{asset.content}</p>

              {asset.status === 'published' && (
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">Reach</p>
                    <p className="font-bold">{(asset.performance.reach / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">Engagement</p>
                    <p className="font-bold">{asset.performance.likes + asset.performance.comments}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAsset(asset)}
                  className="flex-1 p-2 bg-black hover:bg-gray-800 text-white text-xs rounded flex items-center justify-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  View
                </button>
                <button
                  onClick={() => deleteAsset(asset.id)}
                  className="p-2 hover:bg-red-100 rounded text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Generator Modal */}
        {showGenerator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">AI Content Generator</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    placeholder="e.g., Fitness Supplements"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Key Benefit</label>
                  <input
                    type="text"
                    value={form.benefit}
                    onChange={(e) => setForm({ ...form, benefit: e.target.value })}
                    placeholder="e.g., 3x faster results"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Target Audience</label>
                  <input
                    type="text"
                    value={form.audience}
                    onChange={(e) => setForm({ ...form, audience: e.target.value })}
                    placeholder="e.g., Fitness enthusiasts"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tone</label>
                  <select
                    value={form.tone}
                    onChange={(e) => setForm({ ...form, tone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Urgent</option>
                    <option>Storytelling</option>
                  </select>
                </div>
              </div>

              {variants.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">Variant {currentIdx + 1} of {variants.length}</p>
                    <div className="flex gap-2 text-xs">
                      <button
                        disabled={currentIdx === 0}
                        onClick={() => setCurrentIdx((idx) => idx - 1)}
                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-40"
                      >Prev</button>
                      <button
                        disabled={currentIdx === variants.length - 1}
                        onClick={() => setCurrentIdx((idx) => idx + 1)}
                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-40"
                      >Next</button>
                    </div>
                  </div>
                  <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold leading-relaxed min-h-[60px] mb-4">{variants[currentIdx]?.text}</p>
                    {variants[currentIdx]?.imageUrl && (
                      <div className="relative group">
                        <img 
                          src={variants[currentIdx].imageUrl} 
                          alt="Generated ad" 
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                regenerateImage(variants[currentIdx].id);
                              }}
                              size="sm" 
                              variant="outline" 
                              className="bg-white/90 hover:bg-white"
                              disabled={imageLoading[variants[currentIdx].id]}
                            >
                              {imageLoading[variants[currentIdx].id] ? 'Regenerating...' : 'Regenerate'}
                            </Button>
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadImage(variants[currentIdx].imageUrl, variants[currentIdx].id);
                              }}
                              size="sm" 
                              variant="outline" 
                              className="bg-white/90 hover:bg-white"
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                        {imageLoading[variants[currentIdx].id] && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => {
                        const newAsset = {
                          id: Date.now().toString(),
                          title: form.product,
                          type: 'AD_COPY',
                          platform: 'meta',
                          status: 'draft',
                          content: variants[currentIdx]?.text || '',
                          performance: { reach: 0, likes: 0, comments: 0 },
                        } as any;
                        setAssets((prev) => [...prev, newAsset]);
                        showToast('Content added to library', 'success');
                        setShowGenerator(false);
                      }}
                      className="flex-1 bg-black hover:bg-gray-800 text-white text-xs"
                    >Use This</Button>
                    <Button
                      onClick={generateCopy}
                      disabled={genLoading}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 text-xs"
                    >Regenerate</Button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={generateCopy}
                  disabled={genLoading}
                  className="flex-1 bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Wand2 className="h-4 w-4" />
                  Generate
                </Button>
                <Button
                  onClick={() => setShowGenerator(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Asset Details Modal */}
        {selectedAsset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-8 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedAsset.title}</h2>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Content</p>
                <p className="text-sm leading-relaxed">{selectedAsset.content}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Platform</p>
                  <p className="font-semibold capitalize">{selectedAsset.platform}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="font-semibold capitalize">{selectedAsset.status}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  onClick={() => setSelectedAsset(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

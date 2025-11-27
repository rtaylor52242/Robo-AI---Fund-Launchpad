import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getCampaigns, saveCampaign } from '../services/store';
import { analyzeCampaignPerformance } from '../services/gemini';
import { Campaign, CampaignCategory } from '../types';
import { TrendingUp, Users, DollarSign, Zap, Loader2, Edit2, X, Save } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Campaign>>({});

  useEffect(() => {
    const all = getCampaigns();
    setCampaigns(all);
    if (all.length > 0) setSelectedCampaign(all[0]);
  }, []);

  useEffect(() => {
    const runAnalysis = async () => {
      if (!selectedCampaign) return;
      setLoadingAnalysis(true);
      // Check if we have cached analysis or generate new
      // For demo, we generate new if not present (mocking that logic)
      const result = await analyzeCampaignPerformance(
        selectedCampaign.title,
        selectedCampaign.description,
        selectedCampaign.currentAmount,
        selectedCampaign.targetAmount
      );
      setAnalysis(result);
      setLoadingAnalysis(false);
    };
    runAnalysis();
  }, [selectedCampaign]);

  const handleEditClick = () => {
    if (selectedCampaign) {
      setEditForm({
        title: selectedCampaign.title,
        tagline: selectedCampaign.tagline,
        description: selectedCampaign.description,
        targetAmount: selectedCampaign.targetAmount,
        category: selectedCampaign.category
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedCampaign) return;
    
    const updatedCampaign = {
      ...selectedCampaign,
      ...editForm,
      // Ensure targetAmount is a number
      targetAmount: Number(editForm.targetAmount)
    } as Campaign;

    saveCampaign(updatedCampaign);
    
    // Update local state
    setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    setSelectedCampaign(updatedCampaign);
    setIsEditing(false);
  };

  // Mock data for chart
  const data = [
    { name: 'Day 1', amount: 4000 },
    { name: 'Day 2', amount: 3000 },
    { name: 'Day 3', amount: 2000 },
    { name: 'Day 4', amount: 2780 },
    { name: 'Day 5', amount: 1890 },
    { name: 'Day 6', amount: 2390 },
    { name: 'Today', amount: 3490 },
  ];

  if (!selectedCampaign) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              className="flex-1 md:flex-none bg-slate-800 text-white border border-slate-700 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500"
              onChange={(e) => {
                const c = campaigns.find(c => c.id === e.target.value);
                if(c) setSelectedCampaign(c);
              }}
              value={selectedCampaign.id}
            >
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <button 
              onClick={handleEditClick}
              className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors"
            >
              <Edit2 size={16} /> <span className="hidden sm:inline">Edit Campaign</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium">Total Raised</h3>
              <DollarSign className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-white">${selectedCampaign.currentAmount.toLocaleString()}</p>
            <p className="text-sm text-green-400 mt-1">Target: ${selectedCampaign.targetAmount.toLocaleString()}</p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium">Backers</h3>
              <Users className="text-brand-500" />
            </div>
            <p className="text-3xl font-bold text-white">1,240</p>
            <p className="text-sm text-slate-500 mt-1">Avg contribution: $85</p>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium">Success Probability</h3>
              <TrendingUp className="text-accent-500" />
            </div>
            <p className="text-3xl font-bold text-white">
              {loadingAnalysis ? '...' : (analysis?.successProbability || 0) + '%'}
            </p>
            <p className="text-sm text-slate-500 mt-1">AI Prediction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Funding Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    cursor={{fill: '#334155', opacity: 0.4}}
                  />
                  <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass-panel p-6 rounded-xl border-l-4 border-accent-500">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-accent-500 fill-current" />
              <h3 className="text-xl font-bold text-white">Gemini Insights</h3>
            </div>

            {loadingAnalysis ? (
              <div className="flex flex-col items-center justify-center h-60">
                <Loader2 className="w-8 h-8 text-accent-500 animate-spin mb-2" />
                <p className="text-slate-400">Analyzing campaign data...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Content Sentiment</h4>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${analysis.sentimentScore}%` }}></div>
                  </div>
                  <p className="text-right text-xs text-slate-500 mt-1">{analysis.sentimentScore}/100</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Optimization Tips</h4>
                  <ul className="space-y-3">
                    {analysis.tips.map((tip: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="bg-accent-500/20 text-accent-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
               <p className="text-slate-400">No analysis available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <h2 className="text-2xl font-bold text-white">Edit Campaign Details</h2>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Campaign Title</label>
                <input 
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Tagline</label>
                <input 
                  type="text"
                  value={editForm.tagline}
                  onChange={(e) => setEditForm({...editForm, tagline: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-300 mb-1">Category</label>
                   <select 
                     value={editForm.category}
                     onChange={(e) => setEditForm({...editForm, category: e.target.value as CampaignCategory})}
                     className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                   >
                     {Object.values(CampaignCategory).map(cat => (
                       <option key={cat} value={cat}>{cat}</option>
                     ))}
                   </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1">Funding Goal ($)</label>
                  <input 
                    type="number"
                    value={editForm.targetAmount}
                    onChange={(e) => setEditForm({...editForm, targetAmount: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Description</label>
                <textarea 
                  rows={8}
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-slate-900">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded font-bold flex items-center gap-2 shadow-lg shadow-brand-600/20"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
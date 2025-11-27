import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCampaignDetails, generateCampaignImage, AIResponse } from '../services/gemini';
import { saveCampaign } from '../services/store';
import { Campaign, CampaignCategory, Tier } from '../types';
import { Wand2, Image as ImageIcon, CheckCircle, ArrowRight, Loader2, RefreshCw, Plus, Trash2, Gift } from 'lucide-react';

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [category, setCategory] = useState<CampaignCategory>(CampaignCategory.TECH);
  const [idea, setIdea] = useState('');
  const [goal, setGoal] = useState('');
  const [targetAmount, setTargetAmount] = useState(10000);
  
  // Tiers State
  const [tiers, setTiers] = useState<Tier[]>([
    { id: '1', title: 'Early Bird', amount: 25, description: 'Get a digital copy of the project and a thank you note.' }
  ]);
  const [newTier, setNewTier] = useState<Partial<Tier>>({ title: '', amount: 0, description: '' });

  // AI Generated Content
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const handleInspire = () => {
      if (step !== 1) return; // Only populate on step 1

      const templates = [
        { 
          cat: CampaignCategory.TECH, 
          idea: "A smart wearable that translates sign language into spoken words in real-time using motion sensors and AI.", 
          goal: "Finalize the prototype and fund initial manufacturing run.", 
          target: 75000 
        },
        { 
          cat: CampaignCategory.GAMES, 
          idea: "A cozy farming simulator set on a space station where you grow alien plants and trade with passing starships.", 
          goal: "Hire an artist and sound designer to complete the demo.", 
          target: 25000 
        },
        { 
          cat: CampaignCategory.FILM, 
          idea: "A documentary exploring the hidden underground jazz clubs of 1920s Paris using restored archival footage.", 
          goal: "Cover post-production editing and film festival entry fees.", 
          target: 15000 
        },
        { 
          cat: CampaignCategory.ART, 
          idea: "A kinetic sculpture installation that changes shape based on the current weather data of major cities.", 
          goal: "Purchase raw materials and rent a gallery space for the exhibition.", 
          target: 40000 
        },
        { 
          cat: CampaignCategory.MUSIC, 
          idea: "An AI-collaborative album where listeners can generate their own unique remixes of every track.", 
          goal: "Mastering the tracks and building the web interface.", 
          target: 12000 
        }
      ];

      const random = templates[Math.floor(Math.random() * templates.length)];
      setCategory(random.cat);
      setIdea(random.idea);
      setGoal(random.goal);
      setTargetAmount(random.target);
    };

    window.addEventListener('inspire-me', handleInspire);
    return () => window.removeEventListener('inspire-me', handleInspire);
  }, [step]);

  const handleAIGenerate = async () => {
    if (!idea || !goal) return;
    setLoading(true);
    try {
      const data = await generateCampaignDetails({ idea, goal, category });
      setAiData(data);
      setStep(2);
    } catch (e) {
      alert("AI Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageGenerate = async () => {
    if (!aiData) return;
    setLoading(true);
    try {
      const url = await generateCampaignImage(aiData.description.substring(0, 100)); // Use first 100 chars for prompt
      setImageUrl(url);
      setStep(3);
    } catch (e) {
      alert("Image generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const addTier = () => {
    if (!newTier.title || !newTier.amount || !newTier.description) return;
    setTiers([...tiers, { 
      id: Date.now().toString(), 
      title: newTier.title, 
      amount: Number(newTier.amount), 
      description: newTier.description 
    }]);
    setNewTier({ title: '', amount: 0, description: '' });
  };

  const removeTier = (id: string) => {
    setTiers(tiers.filter(t => t.id !== id));
  };

  const handleLaunch = () => {
    if (!aiData) return;
    
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      creatorName: "Current User", // Mock
      title: aiData.title,
      tagline: aiData.tagline,
      description: aiData.description,
      category: category,
      imageUrl: imageUrl || 'https://picsum.photos/800/450',
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      deadline: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days
      createdAt: new Date().toISOString(),
      status: 'active',
      tiers: tiers,
      aiAnalysis: {
        targetAudience: aiData.targetAudience,
        marketingCopy: aiData.marketingCopy,
        successProbability: Math.floor(Math.random() * (95 - 70) + 70) // Mock initial prob
      }
    };

    saveCampaign(newCampaign);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-colors ${
                step >= s ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}>
                {s}
              </div>
              {s < 5 && <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${step > s ? 'bg-brand-500' : 'bg-slate-800'}`}></div>}
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-2xl p-8">
          
          {/* Step 1: Concept */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">Spark your Idea</h2>
                <p className="mt-2 text-slate-400">Tell Gemini about your dream, and we'll build the campaign.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as CampaignCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                >
                  {Object.values(CampaignCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">What is your project?</label>
                <textarea 
                  rows={4}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g. A smart water bottle that tracks hydration and glows to remind you to drink..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Primary Goal</label>
                <input 
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Raise funds for manufacturing the first batch"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Funding Target ($)</label>
                <input 
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <button 
                onClick={handleAIGenerate}
                disabled={loading || !idea || !goal}
                className="w-full bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 className="w-5 h-5" />}
                {loading ? 'Consulting Gemini...' : 'Generate Campaign'}
              </button>
            </div>
          )}

          {/* Step 2: Review AI Content */}
          {step === 2 && aiData && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-white">Refine your Narrative</h2>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="text-xs text-brand-400 uppercase font-bold tracking-wider">Title</label>
                  <input 
                    value={aiData.title} 
                    onChange={(e) => setAiData({...aiData, title: e.target.value})}
                    className="w-full bg-transparent border-b border-slate-700 text-xl font-bold text-white focus:border-brand-500 outline-none py-2" 
                  />
                </div>

                <div className="group">
                  <label className="text-xs text-brand-400 uppercase font-bold tracking-wider">Tagline</label>
                  <input 
                    value={aiData.tagline} 
                    onChange={(e) => setAiData({...aiData, tagline: e.target.value})}
                    className="w-full bg-transparent border-b border-slate-700 text-lg text-slate-300 focus:border-brand-500 outline-none py-2" 
                  />
                </div>

                <div className="group">
                  <label className="text-xs text-brand-400 uppercase font-bold tracking-wider">Story</label>
                  <textarea 
                    value={aiData.description} 
                    onChange={(e) => setAiData({...aiData, description: e.target.value})}
                    rows={8}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 mt-2 text-slate-300 focus:border-brand-500 outline-none" 
                  />
                </div>
              </div>

              <button 
                onClick={handleImageGenerate}
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                {loading ? 'Generating Visuals...' : 'Next: Generate Visuals'}
              </button>
            </div>
          )}

          {/* Step 3: Visuals */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in text-center">
              <h2 className="text-2xl font-bold text-white">Campaign Visuals</h2>
              
              <div className="relative rounded-xl overflow-hidden aspect-video border-2 border-slate-700 group">
                {loading ? (
                   <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                     <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
                   </div>
                ) : (
                  <>
                    <img src={imageUrl} alt="Campaign" className="w-full h-full object-cover" />
                    <button 
                      onClick={handleImageGenerate}
                      className="absolute bottom-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-brand-600 transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              <p className="text-sm text-slate-400">Gemini generated this image based on your description.</p>

              <button 
                onClick={() => setStep(4)}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                Next: Reward Tiers
              </button>
            </div>
          )}

          {/* Step 4: Rewards */}
          {step === 4 && (
             <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Gift className="text-accent-500"/> Define Reward Tiers</h2>
              <p className="text-slate-400">Create enticing rewards for your backers.</p>

              <div className="space-y-4 mb-8">
                {tiers.map((tier) => (
                  <div key={tier.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center group hover:border-brand-500/50 transition-colors">
                    <div>
                      <h4 className="font-bold text-white">{tier.title} <span className="text-brand-400 ml-2">${tier.amount}</span></h4>
                      <p className="text-sm text-slate-400">{tier.description}</p>
                    </div>
                    <button onClick={() => removeTier(tier.id)} className="text-slate-600 hover:text-red-500 p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {tiers.length === 0 && <p className="text-slate-500 italic text-center py-4">No rewards added yet.</p>}
              </div>

              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-white">Add New Tier</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <input 
                      placeholder="Reward Title (e.g. Early Bird)"
                      value={newTier.title}
                      onChange={(e) => setNewTier({...newTier, title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <input 
                      type="number"
                      placeholder="Amount ($)"
                      value={newTier.amount || ''}
                      onChange={(e) => setNewTier({...newTier, amount: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <textarea 
                      placeholder="Description of what the backer gets..."
                      value={newTier.description}
                      onChange={(e) => setNewTier({...newTier, description: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                      rows={2}
                    />
                  </div>
                </div>
                <button 
                  onClick={addTier}
                  disabled={!newTier.title || !newTier.amount || !newTier.description}
                  className="w-full border border-dashed border-brand-500 text-brand-400 hover:bg-brand-500/10 font-medium py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} /> Add Reward Tier
                </button>
              </div>

              <button 
                onClick={() => setStep(5)}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                Next: Final Review
              </button>
             </div>
          )}

          {/* Step 5: Launch */}
          {step === 5 && aiData && (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-white">Ready to Launch!</h2>
              <p className="text-slate-400">
                Your campaign "{aiData.title}" is set up with {tiers.length} reward tiers and a goal of ${targetAmount.toLocaleString()}.
              </p>
              
              <div className="bg-slate-900/50 rounded-lg p-6 text-left border border-slate-800">
                <h3 className="text-sm uppercase font-bold text-brand-400 mb-2">AI Marketing Strategy</h3>
                <p className="text-slate-300 mb-2"><span className="font-semibold text-white">Target Audience:</span> {aiData.targetAudience}</p>
                <p className="text-slate-300"><span className="font-semibold text-white">Suggested Copy:</span> "{aiData.marketingCopy}"</p>
              </div>

              <button 
                onClick={handleLaunch}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
              >
                Launch Campaign <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
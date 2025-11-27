import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCampaignById, backCampaign } from '../services/store';
import { Campaign } from '../types';
import { Clock, Users, ShieldCheck, Share2 } from 'lucide-react';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);
  const [backingAmount, setBackingAmount] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      setCampaign(getCampaignById(id));
    }
  }, [id]);

  const handleBack = (amount: number) => {
    if (!campaign) return;
    backCampaign(campaign.id, amount);
    setCampaign({ ...campaign, currentAmount: campaign.currentAmount + amount });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!campaign) return <div className="text-white text-center mt-20">Campaign not found</div>;

  const progress = Math.min(100, (campaign.currentAmount / campaign.targetAmount) * 100);

  return (
    <div className="min-h-screen bg-slate-950 pb-12">
       {/* Success Notification */}
       {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce">
          Thanks for your contribution!
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Media & Story */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl overflow-hidden bg-black shadow-2xl border border-slate-800">
               <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-96 object-cover" />
            </div>

            <div className="glass-panel rounded-xl p-8">
              <div className="flex items-center gap-2 text-brand-400 text-sm font-bold uppercase tracking-wider mb-2">
                 {campaign.category}
              </div>
              <h1 className="text-4xl font-extrabold text-white mb-4">{campaign.title}</h1>
              <p className="text-xl text-slate-400 mb-8">{campaign.tagline}</p>
              
              <div className="border-t border-slate-800 pt-8">
                <h3 className="text-2xl font-bold text-white mb-4">About</h3>
                <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                  {campaign.description}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Funding Status & Rewards */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl sticky top-24">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                <div style={{width: `${progress}%`}} className="h-full bg-brand-500"></div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <span className="block text-4xl font-bold text-white">${campaign.currentAmount.toLocaleString()}</span>
                  <span className="text-slate-400">pledged of ${campaign.targetAmount.toLocaleString()} goal</span>
                </div>
                
                <div className="flex gap-8">
                  <div>
                    <span className="block text-2xl font-bold text-white">1,204</span>
                    <span className="text-slate-400">backers</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-white">24</span>
                    <span className="text-slate-400">days to go</span>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href="#rewards"}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 px-6 rounded-lg transition-colors"
                >
                  Back this project
                </button>

                <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-800">
                   <span className="flex items-center gap-1"><ShieldCheck size={16} /> Secure payment</span>
                   <span className="flex items-center gap-1 cursor-pointer hover:text-white"><Share2 size={16} /> Share</span>
                </div>
              </div>
            </div>

            {/* Rewards List */}
            <div id="rewards" className="space-y-4">
              <h3 className="text-xl font-bold text-white">Support Tiers</h3>
              {campaign.tiers.map(tier => (
                <div key={tier.id} className="glass-panel p-6 rounded-xl hover:border-brand-500 transition-colors cursor-pointer group" onClick={() => handleBack(tier.amount)}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-white text-lg">{tier.title}</h4>
                    <span className="bg-slate-800 text-brand-300 px-2 py-1 rounded font-mono">${tier.amount}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{tier.description}</p>
                  <div className="h-0 overflow-hidden group-hover:h-10 transition-all duration-300">
                    <button className="w-full bg-white text-slate-900 font-bold py-2 rounded hover:bg-brand-50">Select Reward</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;

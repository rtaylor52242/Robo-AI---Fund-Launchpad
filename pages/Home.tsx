import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns } from '../services/store';
import { Campaign } from '../types';
import { TrendingUp, Clock, Heart, Search } from 'lucide-react';

const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCampaigns(getCampaigns());

    const handleInspire = () => {
      const terms = ["Technology", "Green", "Future", "Art", "Game", "Space", "AI", "Robot", "Eco"];
      const randomTerm = terms[Math.floor(Math.random() * terms.length)];
      setSearchQuery(randomTerm);
    };

    window.addEventListener('inspire-me', handleInspire);
    return () => window.removeEventListener('inspire-me', handleInspire);
  }, []);

  const calculateProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const filteredCampaigns = campaigns.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || 
           c.description.toLowerCase().includes(q) || 
           c.category.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-12">
      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-slate-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Fund the future with</span>{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-500">AI Precision</span>
                </h1>
                <p className="mt-3 text-base text-slate-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Robo AI uses advanced Gemini AI to help creators build better campaigns and helps backers find the next big thing.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/create" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 md:py-4 md:text-lg transition-all hover:scale-105">
                      Launch Project
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a href="#explore" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-100 bg-brand-900 hover:bg-brand-800 md:py-4 md:text-lg">
                      Explore
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-60 lg:opacity-100"
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1564&q=80"
            alt="Abstract futuristic landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-slate-900/50 to-transparent lg:via-transparent"></div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-accent-500" /> Trending Projects
          </h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-slate-500 h-4 w-4" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => (
              <Link key={campaign.id} to={`/campaign/${campaign.id}`} className="group">
                <div className="glass-panel rounded-xl overflow-hidden hover:ring-2 hover:ring-brand-500 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={campaign.imageUrl} 
                      alt={campaign.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider">
                      {campaign.category}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-2">
                      {campaign.tagline}
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-brand-200 bg-brand-900/50">
                              {calculateProgress(campaign.currentAmount, campaign.targetAmount)}% Funded
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-brand-200">
                              ${campaign.currentAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                          <div 
                            style={{ width: `${calculateProgress(campaign.currentAmount, campaign.targetAmount)}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-brand-500 to-accent-500"
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-slate-500 text-sm border-t border-slate-800 pt-3">
                        <span className="flex items-center gap-1"><Clock size={14} /> 20 Days left</span>
                        <span className="flex items-center gap-1"><Heart size={14} /> 124 Backers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-lg">No projects found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
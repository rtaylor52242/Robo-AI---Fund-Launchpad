export enum CampaignCategory {
  TECH = 'Technology',
  ART = 'Art',
  GAMES = 'Games',
  FILM = 'Film',
  MUSIC = 'Music',
  OTHER = 'Other'
}

export interface Tier {
  id: string;
  title: string;
  amount: number;
  description: string;
}

export interface Campaign {
  id: string;
  creatorName: string;
  title: string;
  tagline: string;
  description: string;
  category: CampaignCategory;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO Date string
  createdAt: string;
  status: 'active' | 'completed' | 'draft';
  tiers: Tier[];
  aiAnalysis?: {
    targetAudience: string;
    marketingCopy: string;
    successProbability: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  backedCampaigns: string[]; // IDs
}

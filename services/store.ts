import { Campaign, CampaignCategory } from '../types';

const STORAGE_KEY = 'robofund_campaigns';

// Initial seed data
const SEED_DATA: Campaign[] = [
  {
    id: '1',
    creatorName: 'Elena Stark',
    title: 'EcoDrone: Reforestation AI',
    tagline: 'Autonomous drones planting 10,000 trees a day.',
    description: 'EcoDrone utilizes advanced computer vision and swarm robotics to identify optimal planting locations and deploy biodegradable seed pods. Help us restore the planet\'s lungs with technology.',
    category: CampaignCategory.TECH,
    imageUrl: 'https://picsum.photos/800/450?random=1',
    targetAmount: 50000,
    currentAmount: 34500,
    deadline: new Date(Date.now() + 86400000 * 20).toISOString(),
    createdAt: new Date().toISOString(),
    status: 'active',
    tiers: [
      { id: 't1', title: 'Seedling Supporter', amount: 25, description: 'Digital thank you card + tree planted in your name.' },
      { id: 't2', title: 'Forest Guardian', amount: 100, description: 'T-shirt + 10 trees planted + GPS coords.' }
    ],
    aiAnalysis: {
      targetAudience: 'Environmental activists, tech enthusiasts, green investors.',
      marketingCopy: 'Join the green revolution from the sky.',
      successProbability: 85
    }
  },
  {
    id: '2',
    creatorName: 'Pixel Studio',
    title: 'Neon Nights: Cyberpunk RPG',
    tagline: 'An open-world RPG set in a procedurally generated mega-city.',
    description: 'Explore the depths of Neo-Tokyo in this immersive RPG. Featuring a unique synth-wave soundtrack and deep character customization powered by generative AI.',
    category: CampaignCategory.GAMES,
    imageUrl: 'https://picsum.photos/800/450?random=2',
    targetAmount: 20000,
    currentAmount: 4500,
    deadline: new Date(Date.now() + 86400000 * 45).toISOString(),
    createdAt: new Date().toISOString(),
    status: 'active',
    tiers: [
      { id: 't1', title: 'Digital Copy', amount: 30, description: 'Steam key on launch.' },
      { id: 't2', title: 'Beta Access', amount: 60, description: 'Play 6 months early + Digital Artbook.' }
    ]
  }
];

export const getCampaigns = (): Campaign[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(stored);
};

export const getCampaignById = (id: string): Campaign | undefined => {
  const campaigns = getCampaigns();
  return campaigns.find(c => c.id === id);
};

export const saveCampaign = (campaign: Campaign): void => {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex(c => c.id === campaign.id);
  if (index >= 0) {
    campaigns[index] = campaign;
  } else {
    campaigns.push(campaign);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
};

export const backCampaign = (id: string, amount: number): void => {
  const campaigns = getCampaigns();
  const campaign = campaigns.find(c => c.id === id);
  if (campaign) {
    campaign.currentAmount += amount;
    saveCampaign(campaign);
  }
};

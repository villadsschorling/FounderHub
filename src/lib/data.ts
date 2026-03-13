// Mock shared data store for the application
// In a real app, this would be a database or a state management store

export type MoneySection = "opportunities" | "savings" | "strategies" | "optimization" | "growth";
export type SocialCategory = "meetings" | "gatherings" | "events" | "vacation";

export type Post = {
  id: number;
  author: string;
  title: string;
  content: string;
  timestamp: string;
  section?: MoneySection;
  category?: SocialCategory;
  comments: Comment[];
};

export type Comment = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
};

export let moneyPosts: Post[] = [
  {
    id: 101,
    author: "GrowthGuru",
    title: "Market Gap in SaaS for Architects",
    content: "Analysis shows a significant lack of project management tools tailored for boutique architecture firms.",
    timestamp: "10:30 AM",
    section: "opportunities",
    comments: [
      { id: 1, author: "Admin", content: "Great insight! We should look into this.", timestamp: "11:00 AM" }
    ],
  },
  {
    id: 102,
    author: "CloudOptimizer",
    title: "Cloud Cost Optimization",
    content: "How we reduced our AWS bill by 35% using reserved instances and spot instances.",
    timestamp: "Yesterday",
    section: "savings",
    comments: [],
  },
  {
    id: 103,
    author: "SaaSStrategist",
    title: "Dynamic Pricing Models",
    content: "A deep dive into how to implement usage-based pricing for your software.",
    timestamp: "2 days ago",
    section: "strategies",
    comments: [],
  },
  {
    id: 104,
    author: "CROMaster",
    title: "Conversion Rate Optimization (CRO)",
    content: "Top 5 changes that increased our landing page conversion by 12%.",
    timestamp: "3 days ago",
    section: "optimization",
    comments: [],
  },
  {
    id: 105,
    author: "ScaleExpert",
    title: "Scaling from 1 to 10 Enterprise Clients",
    content: "The transition from founder-led sales to a dedicated sales team.",
    timestamp: "Last week",
    section: "growth",
    comments: [],
  }
];

export let socialPosts: Post[] = [
  {
    id: 201,
    author: "EventPlanner",
    title: "SaaS Success Summit",
    content: "A major conference focusing on scaling and growth strategies for SaaS companies.",
    timestamp: "12:00 PM",
    category: "events",
    comments: [
      { id: 1, author: "You", content: "Count me in!", timestamp: "1:00 PM" }
    ],
  },
  {
    id: 202,
    author: "NetworkingPro",
    title: "Founder Coffee Chat",
    content: "An informal meetup for coffee and networking before the workday starts.",
    timestamp: "Yesterday",
    category: "gatherings",
    comments: [],
  },
  {
    id: 203,
    author: "StrategyLead",
    title: "Strategic Planning",
    content: "Monthly deep dive into long-term strategies and market trends.",
    timestamp: "3 days ago",
    category: "meetings",
    comments: [],
  },
  {
    id: 204,
    author: "TravelEnthusiast",
    title: "Alpine Ski Getaway",
    content: "A week-long ski trip for community members to relax and recharge.",
    timestamp: "Last week",
    category: "vacation",
    comments: [],
  }
];

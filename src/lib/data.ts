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

export let moneyPosts: Post[] = [];

export let socialPosts: Post[] = [];

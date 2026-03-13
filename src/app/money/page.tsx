'use client'

import { Sidebar } from "@/components/sidebar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { moneyPosts, Post, MoneySection } from "@/lib/data";

export default function MoneyAffairsPage() {
  const [activeSection, setActiveSection] = useState<MoneySection>("opportunities");
  const [posts, setPosts] = useState<Post[]>(moneyPosts);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const sections = {
    opportunities: { title: "Opportunities", description: "New ways to generate revenue and discover new markets." },
    savings: { title: "Money Saving", description: "Tactics and tools to reduce burn rate and optimize expenses." },
    strategies: { title: "Strategies", description: "High-level financial and business strategies for long-term success." },
    optimization: { title: "Optimization", description: "Fine-tuning your operations to maximize efficiency and profit." },
    growth: { title: "Business Growth", description: "Techniques for scaling your business and reaching more customers." }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      author: "You",
      title: newPostTitle,
      content: newPostContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      section: activeSection,
      comments: [],
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    // In a real app, this would be a database update
    moneyPosts.unshift(newPost);

    setNewPostTitle("");
    setNewPostContent("");
  };

  const filteredPosts = posts.filter(post => post.section === activeSection);

  return (
    <Sidebar>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-20">
        <header>
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Money Related Affairs</h1>
          <p className="mt-2 text-[color:var(--text-secondary)]">Optimize your finances, strategize your growth, and find new opportunities.</p>
        </header>

        <nav className="flex gap-4 border-b border-[color:var(--border-subtle)] overflow-x-auto pb-2 scrollbar-hide">
          {(Object.keys(sections) as MoneySection[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeSection === key 
                  ? "border-[color:var(--accent-primary)] text-[color:var(--text-primary)]" 
                  : "border-transparent text-[color:var(--text-tertiary)] hover:text-[color:var(--text-secondary)]"
              }`}
            >
              {sections[key].title}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          <div className="glass-panel p-6 bg-[color:var(--background-overlay)]">
            <h2 className="text-xl font-bold text-[color:var(--text-primary)]">{sections[activeSection].title}</h2>
            <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{sections[activeSection].description}</p>
          </div>

          {/* New Post Form */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-5 border border-[color:var(--border-subtle)]"
          >
            <h3 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">Start a new discussion in {sections[activeSection].title}</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Subject..."
                className="w-full bg-transparent border border-[color:var(--border-subtle)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[color:var(--accent-primary)]"
              />
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share an insight, opportunity or ask a question..."
                className="w-full bg-transparent border border-[color:var(--border-subtle)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[color:var(--accent-primary)] h-24 resize-none"
              />
              <button type="submit" className="btn-primary px-6 py-2 rounded-lg text-sm font-bold">
                Create Post
              </button>
            </form>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/money/${post.id}`}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="glass-panel p-5 border border-[color:var(--border-subtle)] hover:border-[color:var(--accent-primary)] transition-all bg-[color:var(--background-overlay)]"
                >
                  <div className="flex items-center justify-between text-xs text-[color:var(--text-secondary)] mb-3">
                    <span className="font-bold">{post.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments.length}
                      </span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{post.title}</h3>
                  <p className="mt-2 text-sm line-clamp-2 text-[color:var(--text-secondary)]">{post.content}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

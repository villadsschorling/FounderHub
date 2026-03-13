'use client'

import { Sidebar } from "@/components/sidebar";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { socialPosts, Post, SocialCategory } from "@/lib/data";

export default function SocialPage() {
  const [activeCategory, setActiveCategory] = useState<SocialCategory>("meetings");
  const [posts, setPosts] = useState<Post[]>(socialPosts);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const categories = {
    meetings: { title: "Meetings", description: "Join upcoming group meetings and discussions." },
    gatherings: { title: "Gatherings", description: "Informal meetups and networking opportunities." },
    events: { title: "Events", description: "Major community events and industry conferences." },
    vacation: { title: "Vacation", description: "Shared vacations and getaways for the community." }
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
      category: activeCategory,
      comments: [],
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    // Update global state for this session
    socialPosts.unshift(newPost);

    setNewPostTitle("");
    setNewPostContent("");
  };

  const filteredPosts = posts.filter(post => post.category === activeCategory);

  return (
    <Sidebar>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-20">
        <header>
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Social Hub</h1>
          <p className="mt-2 text-[color:var(--text-secondary)]">Connect with the community through meetings, events, and shared getaways.</p>
        </header>

        <nav className="flex gap-4 border-b border-[color:var(--border-subtle)] overflow-x-auto pb-2 scrollbar-hide">
          {(Object.keys(categories) as SocialCategory[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeCategory === key 
                  ? "border-[color:var(--accent-primary)] text-[color:var(--text-primary)]" 
                  : "border-transparent text-[color:var(--text-tertiary)] hover:text-[color:var(--text-secondary)]"
              }`}
            >
              {categories[key].title}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          <div className="glass-panel p-6 bg-[color:var(--background-overlay)] border-l-4 border-[color:var(--accent-primary)]">
            <h2 className="text-xl font-bold text-[color:var(--text-primary)]">{categories[activeCategory].title}</h2>
            <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{categories[activeCategory].description}</p>
          </div>

          {/* New Post Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-5 border border-[color:var(--border-subtle)]"
          >
            <h3 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">Post a new {activeCategory.slice(0, -1)} event or question</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Event name or discussion subject..."
                className="w-full bg-transparent border border-[color:var(--border-subtle)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[color:var(--accent-primary)]"
              />
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Provide details about the meeting, event or getaway..."
                className="w-full bg-transparent border border-[color:var(--border-subtle)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[color:var(--accent-primary)] h-24 resize-none"
              />
              <button type="submit" className="btn-primary px-6 py-2 rounded-lg text-sm font-bold">
                Create Social Post
              </button>
            </form>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/social/${post.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-panel p-6 border border-[color:var(--border-subtle)] hover:border-[color:var(--accent-primary)] transition-all bg-[color:var(--background-overlay)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-[color:var(--accent-warm)] uppercase bg-[color:var(--background-overlay)] px-2 py-1 rounded-md">{post.timestamp}</span>
                      <div className="flex items-center gap-1 text-xs text-[color:var(--text-tertiary)]">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments.length}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{post.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-[color:var(--text-secondary)] line-clamp-3">{post.content}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-[color:var(--text-tertiary)]">Posted by <span className="text-[color:var(--text-primary)] font-medium">{post.author}</span></span>
                    <button className="text-[color:var(--accent-primary)] text-sm font-semibold hover:underline">View Discussion →</button>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

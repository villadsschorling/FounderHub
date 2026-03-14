'use client'

import { Sidebar } from "@/components/sidebar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Post = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  subcategory: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
  comments: { count: number }[];
};

type SocialSection = "founder-retreats" | "meetups" | "collaborations" | "social-lounge" | "success-stories";

export default function SocialPage() {
  const supabase = createClient();
  const [activeSection, setActiveSection] = useState<SocialSection>("founder-retreats");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const sections = {
    "founder-retreats": { title: "Founder Retreats", description: "Exclusive getaways to recharge and network with peers." },
    "meetups": { title: "Meetups", description: "Local gatherings and casual coffee chats." },
    "collaborations": { title: "Collaborations", description: "Find partners for your next big project or initiative." },
    "social-lounge": { title: "Social Lounge", description: "General off-topic discussions and community building." },
    "success-stories": { title: "Success Stories", description: "Celebrate wins and share the journey with the community." }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeSection]);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (full_name),
        comments (id)
      `)
      .eq('category', 'social')
      .eq('subcategory', activeSection)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      const mappedPosts = (data || []).map((post: any) => ({
        ...post,
        commentCount: post.comments?.length || 0
      }));
      setPosts(mappedPosts);
    }
    setLoading(false);
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error:', authError);
      alert("You must be logged in to create a post.");
      return;
    }
    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      alert("Could not find your profile. Please try logging out and back in.");
      return;
    }
    if (!profile) {
      alert("Profile not found. Please complete your profile setup.");
      return;
    }

    const { data: insertedPost, error } = await supabase
      .from('posts')
      .insert([
        {
          author_id: profile.id,
          title: newPostTitle,
          content: newPostContent,
          category: 'social',
          subcategory: activeSection
        }
      ])
      .select();

    if (error) {
      console.error('Error creating post:', error);
      alert(`Failed to create post: ${error.message}`);
    } else {
      console.log('Post created successfully:', insertedPost);
      setNewPostTitle("");
      setNewPostContent("");
      fetchPosts();
    }
  };

  return (
    <Sidebar>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-20">
        <header>
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Social Hub</h1>
          <p className="mt-2 text-[color:var(--text-secondary)]">Connect with other founders on a personal level beyond business.</p>
        </header>

        <nav className="flex gap-4 border-b border-[color:var(--border-subtle)] overflow-x-auto pb-2 scrollbar-hide">
          {(Object.keys(sections) as SocialSection[]).map((key) => (
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

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--accent-primary)] border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {posts.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-[color:var(--border-subtle)] rounded-2xl">
                  <p className="text-[color:var(--text-tertiary)] italic">No discussions here yet. Start the conversation!</p>
                </div>
              ) : (
                posts.map((post: any) => (
                  <Link key={post.id} href={`/social/${post.id}`}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="glass-panel p-5 border border-[color:var(--border-subtle)] hover:border-[color:var(--accent-primary)] transition-all bg-[color:var(--background-overlay)]"
                    >
                      <div className="flex items-center justify-between text-xs text-[color:var(--text-secondary)] mb-3">
                        <span className="font-bold">{post.profiles?.full_name || 'Anonymous Founder'}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {post.commentCount}
                          </span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{post.title}</h3>
                      <p className="mt-2 text-sm line-clamp-2 text-[color:var(--text-secondary)]">{post.content}</p>
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}

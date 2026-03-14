'use client'

import { Sidebar } from "@/components/sidebar";
import { PaywallBlur } from "@/components/paywall-blur";
import { useSubscription } from "@/hooks/use-subscription";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Post = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
  comments: { count: number }[];
};

function WarRoomContent() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (full_name),
        comments (id)
      `)
      .eq('category', 'war-room')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      // Map comments to count for display
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
    if (newPostTitle.trim() === "" || newPostContent.trim() === "") return;

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

    // Get current user profile ID
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
          category: 'war-room'
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
    <div className="flex h-full flex-col gap-8 max-w-5xl mx-auto pb-20">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[color:var(--text-primary)]">
            War Room
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--text-secondary)]">
            A private room to trade notes with other operators.
          </p>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 border border-[color:var(--border-subtle)] bg-[color:var(--background-overlay)]"
      >
        <h3 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">Initialize a new discussion</h3>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <input
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="Subject line..."
            className="w-full bg-transparent border border-[color:var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--accent-primary)] text-[color:var(--text-primary)]"
          />
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's on your mind? Share an insight, strategy, or a problem..."
            className="w-full bg-transparent border border-[color:var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--accent-primary)] text-[color:var(--text-primary)] h-32 resize-none"
          />
          <div className="flex justify-end">
            <button type="submit" className="btn-primary px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all">
              Broadcast to Hub
            </button>
          </div>
        </form>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--accent-primary)] border-t-transparent" />
        </div>
      ) : (
        <section className="grid gap-6">
          {posts.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-[color:var(--border-subtle)] rounded-2xl">
              <p className="text-[color:var(--text-tertiary)] italic">No broadcasts yet. Be the first to initiate a discussion.</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <Link key={post.id} href={`/war-room/${post.id}`}>
                <motion.div
                  whileHover={{ y: -4, borderColor: 'var(--accent-primary)' }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="glass-panel p-6 border border-[color:var(--border-subtle)] bg-[color:var(--background-overlay)] transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-[color:var(--text-tertiary)] mb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-primary)]" />
                      <span>{post.profiles?.full_name || 'Anonymous Founder'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.commentCount}
                      </span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-[color:var(--text-primary)] mb-3">
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-[color:var(--text-secondary)] line-clamp-3">
                    {post.content}
                  </p>
                  <div className="mt-6 flex justify-end">
                    <span className="text-[color:var(--accent-primary)] text-xs font-bold hover:underline">Open Intel →</span>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </section>
      )}
    </div>
  );
}

export default function WarRoomPage() {
  const { subscriptionStatus, loading: subscriptionLoading } = useSubscription();
  
  if (subscriptionLoading) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <p className="text-[color:var(--text-tertiary)] animate-pulse">Loading...</p>
        </div>
      </Sidebar>
    );
  }

  const showPaywall = subscriptionStatus === 'inactive';
  
  return (
    <Sidebar>
      <PaywallBlur isActive={showPaywall}>
        <WarRoomContent />
      </PaywallBlur>
    </Sidebar>
  );
}

'use client'

import { Sidebar } from "@/components/sidebar";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";

export default function MoneyPostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPostAndComments();
    }
  }, [id]);

  async function fetchPostAndComments() {
    setLoading(true);
    
    // Fetch post
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('*, profiles:author_id (full_name)')
      .eq('id', id)
      .single();

    if (postError) {
      console.error('Error fetching post:', postError);
    } else {
      setPost(postData);
    }

    // Fetch comments
    const { data: commentData, error: commentError } = await supabase
      .from('comments')
      .select('*, profiles:author_id (full_name)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (commentError) {
      console.error('Error fetching comments:', commentError);
    } else {
      setComments(commentData || []);
    }
    
    setLoading(false);
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error:', authError);
      alert("You must be logged in to comment.");
      return;
    }
    if (!user) {
      alert("You must be logged in to comment.");
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

    const { data: insertedComment, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: id,
          author_id: profile.id,
          content: newComment.trim()
        }
      ])
      .select();

    if (error) {
      console.error('Error adding comment:', error);
      alert(`Failed to add comment: ${error.message}`);
    } else {
      console.log('Comment added successfully:', insertedComment);
      setNewComment("");
      // Re-fetch comments to show the new one
      const { data: refreshedComments } = await supabase
        .from('comments')
        .select('*, profiles:author_id (full_name)')
        .eq('post_id', id)
        .order('created_at', { ascending: true });
      
      setComments(refreshedComments || []);
    }
  };

  if (loading) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <p className="text-[color:var(--text-tertiary)] animate-pulse">Loading discussion...</p>
        </div>
      </Sidebar>
    );
  }

  if (!post) {
    return (
      <Sidebar>
        <div className="p-10 text-center">
          <h2 className="text-xl font-bold text-[color:var(--text-primary)]">Post not found.</h2>
          <p className="text-[color:var(--text-tertiary)] mt-2">The discussion you're looking for doesn't exist or has been removed.</p>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="max-w-4xl mx-auto pb-20">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to list
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 bg-[color:var(--background-overlay)]"
        >
          <div className="flex items-center justify-between text-xs text-[color:var(--text-tertiary)] mb-4">
            <span className="font-bold text-[color:var(--accent-primary)] uppercase tracking-widest">{post.subcategory}</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)] mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-full bg-[color:var(--border-subtle)] flex items-center justify-center font-bold text-xs">
              {post.profiles?.full_name?.[0] || '?'}
            </div>
            <span className="text-sm font-medium text-[color:var(--text-secondary)]">Posted by {post.profiles?.full_name || 'Anonymous Founder'}</span>
          </div>
          <div className="text-[color:var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </motion.div>

        <div className="mt-12 space-y-8">
          <h2 className="text-xl font-bold text-[color:var(--text-primary)] flex items-center gap-2">
            Comments
            <span className="text-sm font-normal text-[color:var(--text-tertiary)]">({comments.length})</span>
          </h2>

          <div className="space-y-4">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-panel p-4 bg-[color:var(--background-overlay)] border border-[color:var(--border-subtle)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[color:var(--text-primary)]">{comment.profiles?.full_name || 'Anonymous'}</span>
                    <span className="text-xs text-[color:var(--text-tertiary)]">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-[color:var(--text-secondary)]">{comment.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <form onSubmit={handleAddComment} className="glass-panel p-6 border border-[color:var(--border-subtle)]">
            <h3 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">Add to the discussion</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full bg-transparent border border-[color:var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--accent-primary)] h-32 resize-none"
            />
            <div className="mt-4 flex justify-end">
              <button type="submit" className="btn-primary px-8 py-2 rounded-lg text-sm font-bold">
                Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </Sidebar>
  );
}

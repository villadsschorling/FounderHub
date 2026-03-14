'use client'

import { Sidebar } from "@/components/sidebar";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function PostPage() {
  const { id } = useParams();
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
    if (newComment.trim() === "") return;

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
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--accent-primary)] border-t-transparent" />
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
      <div className="max-w-4xl mx-auto py-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 border border-[color:var(--border-subtle)] bg-[color:var(--background-overlay)]"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-black text-[color:var(--accent-primary)] mb-6">
            <span className="h-px w-8 bg-[color:var(--accent-primary)]/40" />
            <span>War Room Intelligence</span>
          </div>
          
          <h1 className="text-4xl font-black text-[color:var(--text-primary)] tracking-tight mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[color:var(--border-subtle)]">
            <div className="h-10 w-10 rounded-full bg-[color:var(--accent-primary)]/10 flex items-center justify-center font-bold text-[color:var(--accent-primary)] border border-[color:var(--accent-primary)]/20">
              {post.profiles?.full_name?.[0] || '?'}
            </div>
            <div>
              <p className="text-sm font-bold text-[color:var(--text-primary)]">{post.profiles?.full_name || 'Anonymous Founder'}</p>
              <p className="text-xs text-[color:var(--text-tertiary)]">{new Date(post.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg leading-relaxed text-[color:var(--text-secondary)] whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="mt-12 pt-12 border-t border-[color:var(--border-subtle)]">
            <h2 className="text-xl font-bold text-[color:var(--text-primary)] mb-8 flex items-center gap-3">
              Discussion 
              <span className="px-2 py-0.5 rounded-full bg-[color:var(--background-base)] text-xs font-bold border border-[color:var(--border-subtle)]">
                {comments.length}
              </span>
            </h2>
            
            <div className="space-y-6 mb-10">
              {comments.length === 0 ? (
                <p className="text-sm italic text-[color:var(--text-tertiary)]">No responses yet. Be the first to provide intel.</p>
              ) : (
                comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-[color:var(--background-base)] flex items-center justify-center text-xs font-bold border border-[color:var(--border-subtle)] flex-shrink-0">
                      {comment.profiles?.full_name?.[0] || '?'}
                    </div>
                    <div className="flex-1 glass-panel p-4 border border-[color:var(--border-subtle)] bg-[color:var(--background-base)]/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-[color:var(--text-primary)]">{comment.profiles?.full_name || 'Anonymous'}</span>
                        <span className="text-[10px] text-[color:var(--text-tertiary)]">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-[color:var(--background-base)] border border-[color:var(--border-subtle)] rounded-xl p-4 text-sm focus:outline-none focus:border-[color:var(--accent-primary)] text-[color:var(--text-primary)] h-24 resize-none"
                placeholder="Add your perspective..."
              />
              <div className="flex justify-end">
                <button type="submit" className="btn-primary px-6 py-2 rounded-lg text-xs font-bold">
                  Post Response
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </Sidebar>
  );
}

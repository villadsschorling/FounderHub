'use client'

import { Sidebar } from "@/components/sidebar";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socialPosts, Post, Comment } from "@/lib/data";

export default function SocialPostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (id) {
      const foundPost = socialPosts.find((p) => p.id === parseInt(id as string));
      if (foundPost) {
        setPost(foundPost);
      }
    }
  }, [id]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    const comment: Comment = {
      id: Date.now(),
      author: "You",
      content: newComment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedPost = {
      ...post,
      comments: [...post.comments, comment]
    };

    setPost(updatedPost);
    setNewComment("");

    // Update global state
    const index = socialPosts.findIndex(p => p.id === post.id);
    if (index !== -1) {
      socialPosts[index] = updatedPost;
    }
  };

  if (!post) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <p className="text-[color:var(--text-tertiary)] animate-pulse">Loading event details...</p>
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
          Back to Social Hub
        </button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 bg-[color:var(--background-overlay)] border-t-4 border-[color:var(--accent-warm)]"
        >
          <div className="flex items-center justify-between text-xs text-[color:var(--text-tertiary)] mb-4">
            <span className="font-bold text-[color:var(--accent-warm)] uppercase tracking-widest">{post.category}</span>
            <span>{post.timestamp}</span>
          </div>
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)] mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-full bg-[color:var(--border-subtle)] flex items-center justify-center font-bold text-xs">
              {post.author[0]}
            </div>
            <span className="text-sm font-medium text-[color:var(--text-secondary)]">Organized by {post.author}</span>
          </div>
          <div className="text-[color:var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-lg">
            {post.content}
          </div>
          <div className="mt-8 pt-8 border-t border-[color:var(--border-subtle)] flex gap-4">
            <button className="btn-primary px-6 py-2 rounded-lg text-sm font-bold flex-1">I'm Interested / RSVP</button>
            <button className="glass-panel px-6 py-2 rounded-lg text-sm font-bold flex-1 border border-[color:var(--border-subtle)] hover:bg-[color:var(--background-overlay)] transition-colors">Add to Calendar</button>
          </div>
        </motion.div>

        <div className="mt-12 space-y-8">
          <h2 className="text-xl font-bold text-[color:var(--text-primary)] flex items-center gap-2">
            Discussion
            <span className="text-sm font-normal text-[color:var(--text-tertiary)]">({post.comments.length})</span>
          </h2>

          <div className="space-y-4">
            <AnimatePresence>
              {post.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-4 bg-[color:var(--background-overlay)] border border-[color:var(--border-subtle)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[color:var(--text-primary)]">{comment.author}</span>
                    <span className="text-xs text-[color:var(--text-tertiary)]">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-[color:var(--text-secondary)]">{comment.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <form onSubmit={handleAddComment} className="glass-panel p-6 border border-[color:var(--border-subtle)]">
            <h3 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">Leave a comment or ask a question</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your message..."
              className="w-full bg-transparent border border-[color:var(--border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--accent-primary)] h-32 resize-none"
            />
            <div className="mt-4 flex justify-end">
              <button type="submit" className="btn-primary px-8 py-2 rounded-lg text-sm font-bold">
                Post Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </Sidebar>
  );
}

'use client'

import { Sidebar } from "@/components/sidebar";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

type Post = {
  id: number;
  author: string;
  title: string;
  content: string;
  timestamp: string;
  comments: any[];
};

let seedPosts: Post[] = [
  {
    id: 1,
    author: "Acme Analytics",
    title: "Pricing Strategy Teardown",
    content:
      "We pushed pricing from $39 to $59 and saw activation jump once onboarding was simplified. Happy to share the onboarding flow.",
    timestamp: "09:12",
    comments: [],
  },
  {
    id: 2,
    author: "Northbound Labs",
    title: "Founder Newsletter Conversion Rates",
    content:
      "Anyone running a founder newsletter and tying it back to product usage? Curious what open → signup conversion you’re seeing.",
    timestamp: "09:19",
    comments: [],
  },
];

function WarRoomContent() {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostTitle.trim() === "" || newPostContent.trim() === "") return;

    const newPost = {
      id: Date.now(),
      author: "You",
      title: newPostTitle,
      content: newPostContent,
      timestamp: new Date().toLocaleTimeString(),
      comments: [],
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    seedPosts = updatedPosts; // Hack to update seed data

    setNewPostTitle("");
    setNewPostContent("");
  };

  return (
    <div className="flex h-full flex-col gap-8">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
            War Room
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--text-secondary)]">
            A private room to trade notes with other operators.
          </p>
        </div>
      </header>

      <div className="mb-8">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <input
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="Post title"
            className="w-full rounded-md border bg-transparent p-2"
          />
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full rounded-md border bg-transparent p-2"
          />
          <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-white">
            Create Post
          </button>
        </form>
      </div>

      <section className="grid gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/war-room/${post.id}`}>
            <motion.div
              whileHover={{ y: -2, scale: 1.005 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="glass-panel p-5"
            >
              <div className="flex items-center justify-between text-xs text-[color:var(--text-secondary)]">
                <span>{post.author}</span>
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
              <h2 className="mt-4 text-lg font-semibold text-[color:var(--text-primary)]">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-secondary)]">
                {post.content}
              </p>
            </motion.div>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default function WarRoomPage() {
  return (
    <Sidebar>
      <WarRoomContent />
    </Sidebar>
  );
}

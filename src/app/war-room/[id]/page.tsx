'use client'

import { Sidebar } from "@/components/sidebar";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

// This would typically be fetched from a database or state management store
let seedPosts = [
  {
    id: 1,
    author: "Acme Analytics",
    title: "Pricing Strategy Teardown",
    content:
      "We pushed pricing from $39 to $59 and saw activation jump once onboarding was simplified. Happy to share the onboarding flow.",
    timestamp: "09:12",
    comments: [
      { id: 1, author: "You", content: "This is great!" },
    ],
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

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (id) {
      const foundPost = seedPosts.find((p) => p.id === parseInt(id as string));
      setPost(foundPost);
    }
  }, [id]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const updatedPost = { ...post };
    updatedPost.comments.push({ id: Date.now(), author: "You", content: newComment });
    setPost(updatedPost);
    setNewComment("");

    // This is a hack to update the seed data. In a real app, you'd send this to a server.
    const postIndex = seedPosts.findIndex(p => p.id === post.id);
    if (postIndex !== -1) {
      seedPosts[postIndex] = updatedPost;
    }
  };

  if (!post) {
    return (
      <Sidebar>
        <div>Loading...</div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="p-5">
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="mt-2 text-sm text-gray-500">By {post.author} at {post.timestamp}</p>
        <p className="mt-4">{post.content}</p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Comments</h2>
          <div className="mt-4 space-y-4">
            {post.comments.map((comment: any) => (
              <div key={comment.id} className="rounded-md border p-4">
                <p className="font-semibold">{comment.author}</p>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full rounded-md border bg-transparent p-2"
              placeholder="Add a comment..."
            />
            <button type="submit" className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white">
              Add Comment
            </button>
          </form>
        </div>
      </div>
    </Sidebar>
  );
}

 "use client";

import { Sidebar } from "@/components/sidebar";
import { motion } from "framer-motion";
import { useState } from "react";

type Message = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
};

const seedMessages: Message[] = [
  {
    id: 1,
    author: "Acme Analytics",
    content:
      "We pushed pricing from $39 to $59 and saw activation jump once onboarding was simplified. Happy to share the onboarding flow.",
    timestamp: "09:12",
  },
  {
    id: 2,
    author: "Northbound Labs",
    content:
      "Anyone running a founder newsletter and tying it back to product usage? Curious what open → signup conversion you’re seeing.",
    timestamp: "09:19",
  },
];

function WarRoomContent() {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const msg: Message = {
      id: messages.length + 1,
      author: "You",
      content: draft.trim(),
      timestamp: now.toTimeString().slice(0, 5),
    };
    setMessages((prev) => [...prev, msg]);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col gap-8">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
            War Room
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--text-secondary)]">
            A private room to trade notes with other operators. Messages are
            mocked locally for now.
          </p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr),minmax(0,0.9fr)]">
        <motion.div
          whileHover={{ y: -2, scale: 1.005 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="glass-panel p-5"
        >
          <div className="flex items-center justify-between text-xs text-[color:var(--text-secondary)]">
            <span>War Room feed</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-warm)] shadow-[0_0_10px_rgba(244,162,97,0.9)]" />
              Live thread
            </span>
          </div>
          <div className="mt-4 h-[380px] space-y-3 overflow-y-auto pr-2 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className="glass-panel--subtle border border-[color:var(--border-subtle)] px-3 py-3"
              >
                <div className="flex items-center justify-between text-[11px] text-[color:var(--text-secondary)]">
                  <span className="font-medium text-[color:var(--text-primary)]">
                    {m.author}
                  </span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-secondary)]">
                  {m.content}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, scale: 1.005 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="glass-panel p-5"
        >
          <h2 className="text-sm font-medium text-[color:var(--text-primary)]">
            Draft a note
          </h2>
          <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
            Share one specific problem or learning. Keep it tactical.
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div className="input-shell">
              <textarea
                className="h-32 w-full resize-none bg-transparent px-3 py-2 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
                placeholder="Ask for a teardown, share a recent win, or talk through a growth question…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[color:var(--text-tertiary)]">
              <span>Visible to founders inside this hub only.</span>
              <button
                type="button"
                onClick={handleSend}
                className="btn-primary inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium"
              >
                Post to War Room
              </button>
            </div>
          </div>
        </motion.div>
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


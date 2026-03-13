 "use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const mockPeerData = [
  { label: "You", revenue: 80, burn: 55, headcount: 18 },
  { label: "Cohort avg", revenue: 62, burn: 50, headcount: 15 },
];

export function BenchmarkDashboard() {
  return (
    <div className="flex h-full flex-col gap-10 text-[color:var(--text-primary)]">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">
          Benchmarking
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--text-secondary)]">
            Private operator view of your operating metrics, compared against
            the rest of the hub. Numbers are mocked for now.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-warm)] shadow-[0_0_12px_rgba(244,162,97,0.9)]" />
          Sync latest metrics
        </button>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)]">
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="glass-panel chart-surface p-6"
        >
          <h2 className="text-sm font-medium text-[color:var(--text-primary)]">
            Benchmark inputs
          </h2>
          <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
            We&apos;ll eventually persist this to Supabase. For now, it&apos;s
            just UI.
          </p>

          <form className="mt-6 grid gap-5 text-sm lg:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wide text-[color:var(--text-secondary)]">
                Monthly revenue
              </label>
              <div className="input-shell flex items-center px-3 py-2.5">
                <span className="mr-2 text-xs text-[color:var(--text-tertiary)]">$</span>
                <input
                  type="number"
                  placeholder="35,000"
                  className="h-6 w-full bg-transparent text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wide text-[color:var(--text-secondary)]">
                Monthly burn
              </label>
              <div className="input-shell flex items-center px-3 py-2.5">
                <span className="mr-2 text-xs text-[color:var(--text-tertiary)]">$</span>
                <input
                  type="number"
                  placeholder="28,000"
                  className="h-6 w-full bg-transparent text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wide text-[color:var(--text-secondary)]">
                Headcount
              </label>
              <div className="input-shell flex items-center px-3 py-2.5">
                <input
                  type="number"
                  placeholder="12"
                  className="h-6 w-full bg-transparent text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              className="btn-primary mt-2 inline-flex items-center justify-center px-3 py-2 text-sm font-medium"
            >
              Update benchmark
            </button>
          </form>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.01, boxShadow: "0 4px 16px rgba(100, 50, 10, 0.12)" }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="glass-panel chart-surface p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-[color:var(--text-primary)]">
                Peer comparison
              </h2>
              <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                Mock chart comparing you vs. cohort averages.
              </p>
            </div>
            <div className="flex gap-3 text-[11px] text-[color:var(--text-secondary)]">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[color:var(--accent-primary)] shadow-[0_0_16px_rgba(232,93,4,0.9)]" />
                You
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[color:var(--accent-warm)]" />
                Cohort
              </div>
            </div>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPeerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(180, 130, 90, 0.25)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  stroke="#7c5c3e"
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  stroke="#7c5c3e"
                  tickMargin={8}
                  tickFormatter={(value) => `${value}k`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(244, 162, 97, 0.12)" }}
                  contentStyle={{
                    background:
                      "linear-gradient(180deg, rgba(244, 162, 97, 0.18), rgba(255, 255, 255, 0.98))",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(180, 130, 90, 0.25)",
                    padding: "0.6rem 0.8rem",
                    fontSize: "0.75rem",
                    boxShadow: "0 4px 16px rgba(100, 50, 10, 0.12)",
                  }}
                  labelStyle={{ color: "#1a0f05", marginBottom: 4 }}
                />
                <defs>
                  <linearGradient id="revenueGradientFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#e85d04" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#e85d04" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#e85d04" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradientFill)"
                  radius={[8, 8, 0, 0]}
                  name="Revenue (k$)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>
    </div>
  );
}


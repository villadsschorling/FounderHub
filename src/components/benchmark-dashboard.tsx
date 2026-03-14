"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Line,
  LineChart,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const mockPeerData = [
  { label: "You", revenue: 85000, burn: 45000, headcount: 12, growth: 15 },
  { label: "Cohort Avg", revenue: 62000, burn: 52000, headcount: 15, growth: 8 },
  { label: "Top 10%", revenue: 145000, burn: 38000, headcount: 10, growth: 28 },
];

const revenueTrend = [
  { month: "Jan", you: 45000, avg: 42000 },
  { month: "Feb", you: 52000, avg: 44000 },
  { month: "Mar", you: 61000, avg: 48000 },
  { month: "Apr", you: 68000, avg: 51000 },
  { month: "May", you: 75000, avg: 55000 },
  { month: "Jun", you: 85000, avg: 62000 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function BenchmarkDashboard() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-16 pb-20 text-[color:var(--text-primary)]"
    >
      {/* Hero Header Section */}
      <motion.header variants={itemVariants} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[color:var(--accent-gradient)] flex items-center justify-center shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Performance Benchmarking</h1>
        </div>
        <p className="max-w-2xl text-lg text-[color:var(--text-secondary)] leading-relaxed">
          Detailed breakdown of your operational health compared to 142 other Series A SaaS founders in the Hub.
        </p>
      </motion.header>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Revenue Percentile", value: "Top 12%", trend: "+3% vs last mo", color: "var(--accent-primary)" },
          { label: "Efficiency Score", value: "8.4/10", trend: "Highly Efficient", color: "#10b981" },
          { label: "Burn Velocity", value: "Optimal", trend: "22 mo runway", color: "#3b82f6" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-panel p-6 border-l-4"
            style={{ borderLeftColor: stat.color }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--text-tertiary)]">{stat.label}</p>
            <h3 className="mt-2 text-3xl font-bold">{stat.value}</h3>
            <p className="mt-1 text-sm font-medium text-[color:var(--text-secondary)]">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      {/* Large Peer Comparison Chart */}
      <motion.section variants={itemVariants} className="glass-panel p-8 bg-[color:var(--background-surface)] shadow-xl border border-[color:var(--border-subtle)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Peer Revenue Comparison</h2>
            <p className="text-sm text-[color:var(--text-secondary)]">Monthly Recurring Revenue (MRR) vs cohort benchmarks</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 text-xs font-bold rounded-full bg-[color:var(--background-overlay)] border border-[color:var(--border-subtle)] hover:bg-[color:var(--accent-primary)] hover:text-white transition-all">Export Report</button>
            <button className="px-4 py-1.5 text-xs font-bold rounded-full bg-[color:var(--accent-primary)] text-white shadow-md hover:brightness-110 transition-all">Live Cohort</button>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockPeerData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--accent-warm)" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(124, 92, 62, 0.1)" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                cursor={{ fill: 'var(--background-overlay)', opacity: 0.4 }}
                contentStyle={{ 
                  backgroundColor: 'var(--background-surface)', 
                  borderRadius: '16px', 
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="revenue" 
                radius={[10, 10, 0, 0]} 
                barSize={60}
                animationBegin={500}
                animationDuration={1500}
              >
                {mockPeerData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.label === 'You' ? 'url(#barGradient)' : 'var(--background-overlay)'}
                    stroke={entry.label === 'You' ? 'transparent' : 'var(--border-subtle)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Two Column Section: Growth Trend & Input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Growth Trend Chart */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8"
        >
          <h2 className="text-xl font-bold mb-2">Revenue Growth Trend</h2>
          <p className="text-sm text-[color:var(--text-secondary)] mb-8">6-month trajectory vs cohort average</p>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorYou" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="you" 
                  stroke="var(--accent-primary)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorYou)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="var(--text-tertiary)" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Input Form Section */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 flex flex-col justify-center"
        >
          <h2 className="text-xl font-bold mb-2">Update Your Numbers</h2>
          <p className="text-sm text-[color:var(--text-secondary)] mb-6">Sync your latest data to update benchmarks across the hub.</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--text-tertiary)]">Monthly Revenue</label>
                <div className="input-shell px-4 py-2 flex items-center">
                  <span className="text-[color:var(--text-tertiary)] mr-2">$</span>
                  <input type="number" placeholder="85,000" className="bg-transparent w-full outline-none text-sm font-semibold" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--text-tertiary)]">Monthly Burn</label>
                <div className="input-shell px-4 py-2 flex items-center">
                  <span className="text-[color:var(--text-tertiary)] mr-2">$</span>
                  <input type="number" placeholder="45,000" className="bg-transparent w-full outline-none text-sm font-semibold" />
                </div>
              </div>
            </div>
            <button className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Recalculate Benchmarks
            </button>
          </div>
        </motion.section>
      </div>

      {/* Scroll Down Deep Metrics Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mt-10"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[color:var(--accent-primary)]">Operational Deep Dive</h2>
          <p className="text-[color:var(--text-secondary)]">Scroll further to explore granular efficiency metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "CAC Payback", value: "4.2 mo", target: "< 6.0 mo", status: "Healthy" },
            { title: "LTV / CAC", value: "5.1x", target: "> 3.0x", status: "Strong" },
            { title: "Net Retention", value: "112%", target: "> 105%", status: "Good" },
            { title: "Magic Number", value: "0.92", target: "> 0.75", status: "Scaling" },
          ].map((m, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05 }}
              className="glass-panel p-6 bg-[color:var(--background-overlay)] flex flex-col items-center text-center"
            >
              <span className="text-xs font-bold text-[color:var(--text-tertiary)] uppercase mb-3">{m.title}</span>
              <div className="text-2xl font-bold text-[color:var(--text-primary)]">{m.value}</div>
              <div className="mt-2 text-[10px] font-medium px-2 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-500/20">{m.status}</div>
              <div className="mt-4 text-[10px] text-[color:var(--text-tertiary)]">Target: {m.target}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}

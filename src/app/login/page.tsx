'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { HomeDashboard } from '@/components/home-dashboard'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  
  // Step management: start -> questions -> auth -> payment
  const [step, setStep] = useState<'start' | 'questions' | 'auth' | 'payment'>('start')
  const [loading, setLoading] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  
  // Onboarding Data
  const [industry, setIndustry] = useState('')
  const [customIndustry, setCustomIndustry] = useState('')
  const [isOtherIndustry, setIsOtherIndustry] = useState(false)
  const [mrr, setMrr] = useState('')
  const [role, setRole] = useState('')
  
  // Auth Data
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('industry')
          .eq('user_id', data.user.id)
          .maybeSingle()
        
        if (profile?.industry) {
          router.push('/')
        } else {
          setStep('questions')
        }
      }
    }
    checkUser()
  }, [supabase, router])

  const handleAuthChoice = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    if (mode === 'signin') {
      setStep('auth')
    } else {
      setStep('questions')
    }
  }

  const handleNextToAuth = (e: React.FormEvent) => {
    e.preventDefault()
    const finalIndustry = isOtherIndustry ? customIndustry : industry
    if (!finalIndustry || !mrr || !role) {
      alert("Please fill out all questions first!")
      return
    }
    setStep('auth')
  }

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      alert("Please enter your email and password.")
      return
    }
    setLoading(true)
    
    if (authMode === 'signin') {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        alert(signInError.message)
        setLoading(false)
        return
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('industry')
        .eq('user_id', signInData.user?.id)
        .maybeSingle()
      
      if (profile?.industry) {
        router.push('/')
      } else {
        setStep('payment')
      }
    } else {
      // Check if user already exists (signUp in Supabase will return error or identity if exists)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            // Optional: add metadata if needed
          }
        }
      })
      
      if (signUpError) {
        alert(signUpError.message)
        setLoading(false)
        return
      }
      
      // If signUp returns a session, or user is created, proceed
      if (signUpData.user) {
        // In Supabase, if email confirmation is off, user is logged in immediately.
        // If on, we might need to handle that, but assuming standard flow for now.
        setStep('payment')
      }
    }
    setLoading(false)
  }

  const handleFinalJoin = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("Session lost. Please try logging in again.")
      setStep('auth')
      setLoading(false)
      return
    }

    const finalIndustry = isOtherIndustry ? customIndustry : industry

    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .maybeSingle()

    const { error } = await supabase
      .from('profiles')
      .update({
        industry: finalIndustry,
        mrr: isNaN(parseInt(mrr)) ? 0 : parseInt(mrr),
        role,
        full_name: currentProfile?.full_name || email.split('@')[0]
      })
      .eq('user_id', user.id)

    if (error) {
      console.error('Final join save error:', error)
      alert("Error saving your profile: " + error.message)
    } else {
      console.log('Profile saved successfully, entering hub...')
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Washed out background of the actual site */}
      <div className="pointer-events-none absolute inset-0 opacity-5 blur-xl grayscale select-none overflow-hidden">
        <div className="p-10 scale-95 origin-top">
          <HomeDashboard />
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-50 flex min-h-screen items-center justify-center bg-black/70 backdrop-blur-md px-4 py-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: START (Auth Choice) */}
          {step === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-lg p-1 bg-[#0d0d0d] rounded-[2.5rem] shadow-[0_0_100px_rgba(244,162,97,0.1)] border border-white/5 overflow-hidden"
            >
              <div className="relative p-12 text-center">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#f4a261]/10 blur-[100px] -z-10" />
                
                <div className="mb-12">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="h-px w-8 bg-[#f4a261]/40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f4a261]">Founder Hub</span>
                    <span className="h-px w-8 bg-[#f4a261]/40" />
                  </div>
                  <h1 className="text-5xl font-black text-white tracking-tighter leading-tight mb-4">
                    Ready to <span className="text-[#f4a261]">Scale?</span>
                  </h1>
                  <p className="text-white/40 text-sm leading-relaxed mx-auto max-w-xs">
                    Join the exclusive network of SaaS founders and operators.
                  </p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => handleAuthChoice('signup')}
                    className="group w-full bg-[#f4a261] hover:bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#f4a261]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    Create New Account
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => handleAuthChoice('signin')}
                    className="w-full bg-white/5 hover:bg-white/10 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] border border-white/10 active:scale-[0.98] transition-all"
                  >
                    Sign In to Hub
                  </button>
                </div>

                <p className="mt-8 text-[10px] text-white/20 font-medium uppercase tracking-widest">
                  Restricted access for verified founders only
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 1: QUESTIONS */}
          {step === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg p-1 bg-[#0d0d0d] rounded-[2.5rem] shadow-[0_0_100px_rgba(244,162,97,0.05)] border border-white/5 overflow-hidden"
            >
              <div className="relative p-12">
                <button 
                  onClick={() => setStep('start')}
                  className="absolute top-8 left-8 text-[10px] font-bold text-white/40 hover:text-[#f4a261] transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
                </button>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f4a261]/10 blur-[80px] -z-10" />
                
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-8 bg-[#f4a261]/40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f4a261]">Exclusive Access</span>
                  </div>
                  <h1 className="text-5xl font-black text-white tracking-tighter leading-tight mb-4">
                    The Hub is for <span className="text-[#f4a261]">Founders</span>.
                  </h1>
                  <p className="text-white/40 text-sm leading-relaxed max-w-md">
                    To maintain our high-signal community, we need to understand your current trajectory. 
                    These details will be displayed on your profile.
                  </p>
                </div>
                
                <form onSubmit={handleNextToAuth} className="space-y-10">
                  {/* Industry Question */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase tracking-widest opacity-80">1. Core Industry</label>
                      {industry && <span className="text-[10px] text-[#f4a261] font-bold">✓ Selection captured</span>}
                    </div>
                    <div className="space-y-3">
                      <div className="relative">
                        <select 
                          value={isOtherIndustry ? 'Other' : industry}
                          onChange={e => {
                            if (e.target.value === 'Other') {
                              setIsOtherIndustry(true)
                              setIndustry('')
                            } else {
                              setIsOtherIndustry(false)
                              setIndustry(e.target.value)
                            }
                          }}
                          className={`w-full bg-[#141414] border-2 ${industry || isOtherIndustry ? 'border-[#f4a261] shadow-[0_0_25px_rgba(244,162,97,0.1)]' : 'border-white/5'} rounded-2xl px-6 py-5 text-white outline-none focus:border-[#f4a261] focus:ring-4 focus:ring-[#f4a261]/10 transition-all text-sm appearance-none cursor-pointer hover:bg-[#1a1a1a]`}
                          required
                        >
                          <option value="" disabled>Choose your sector...</option>
                          <option value="SaaS">SaaS / Enterprise Software</option>
                          <option value="Fintech">Fintech / Finance</option>
                          <option value="AI">AI / Deep Tech</option>
                          <option value="E-commerce">E-commerce / Consumer</option>
                          <option value="Agency">Agency / Services</option>
                          <option value="Other">Other (Custom entry)</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#f4a261]">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isOtherIndustry && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            className="pt-1 overflow-hidden"
                          >
                            <input 
                              type="text" 
                              value={customIndustry}
                              onChange={e => setCustomIndustry(e.target.value)}
                              placeholder="Describe your industry..."
                              className="w-full bg-[#141414] border-2 border-[#f4a261] rounded-2xl px-6 py-5 text-white outline-none focus:ring-4 focus:ring-[#f4a261]/10 text-sm shadow-[0_0_30px_rgba(244,162,97,0.15)]"
                              required={isOtherIndustry}
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* MRR Question */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase tracking-widest opacity-80">2. Current MRR</label>
                      {mrr && <span className="text-[10px] text-[#f4a261] font-bold">✓ Data logged</span>}
                    </div>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#f4a261] font-bold text-lg">$</div>
                      <input 
                        type="number" 
                        value={mrr}
                        onChange={e => setMrr(e.target.value)}
                        placeholder="0.00"
                        className={`w-full bg-[#141414] border-2 ${mrr ? 'border-[#f4a261] shadow-[0_0_25px_rgba(244,162,97,0.1)]' : 'border-white/5'} rounded-2xl px-14 py-5 text-white outline-none focus:border-[#f4a261] focus:ring-4 focus:ring-[#f4a261]/10 transition-all text-sm hover:bg-[#1a1a1a]`}
                        required
                      />
                    </div>
                    <p className="text-[10px] text-white/30 italic px-2">This helps us group you with relevant peers in the War Room.</p>
                  </div>

                  {/* Role Question */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase tracking-widest opacity-80">3. Your Role</label>
                      {role && <span className="text-[10px] text-[#f4a261] font-bold">✓ Title confirmed</span>}
                    </div>
                    <input 
                      type="text" 
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      placeholder="e.g. CEO & Co-founder"
                      className={`w-full bg-[#141414] border-2 ${role ? 'border-[#f4a261] shadow-[0_0_25px_rgba(244,162,97,0.1)]' : 'border-white/5'} rounded-2xl px-6 py-5 text-white outline-none focus:border-[#f4a261] focus:ring-4 focus:ring-[#f4a261]/10 transition-all text-sm hover:bg-[#1a1a1a]`}
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="group w-full bg-[#f4a261] hover:bg-white text-black py-6 mt-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#f4a261]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    Enter the Verification Phase
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* STEP 2: AUTH */}
          {step === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full max-w-md p-1 bg-[#0d0d0d] rounded-[2.5rem] shadow-[0_0_100px_rgba(244,162,97,0.05)] border border-white/5 overflow-hidden"
            >
              <div className="relative p-12">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f4a261]/10 blur-[80px] -z-10" />
                
                <div className="mb-10">
                  <button 
                    onClick={() => setStep(authMode === 'signin' ? 'start' : 'questions')}
                    className="text-[10px] font-bold text-white/40 hover:text-[#f4a261] transition-colors mb-8 flex items-center gap-2 group"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> {authMode === 'signin' ? 'Back to Start' : 'Edit Details'}
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="h-px w-8 bg-[#f4a261]/40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f4a261]">
                      {authMode === 'signin' ? 'Hub Access' : 'Phase 2: Security'}
                    </span>
                  </div>
                  <h1 className="text-4xl font-black text-white tracking-tight">
                    {authMode === 'signin' ? 'Welcome Back' : 'Secure Your Hub Access'}
                  </h1>
                  <p className="text-sm text-white/40 mt-3 leading-relaxed">
                    {authMode === 'signin' 
                      ? 'Enter your credentials to re-enter the Hub.' 
                      : 'Create your credentials to access the private network and benchmarking tools.'}
                  </p>
                </div>
                
                <form onSubmit={handleAuthentication} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white uppercase tracking-widest opacity-80">Work Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={`w-full bg-[#141414] border-2 ${email ? 'border-[#f4a261] shadow-[0_0_25px_rgba(244,162,97,0.1)]' : 'border-white/5'} rounded-2xl px-6 py-5 text-white outline-none focus:border-[#f4a261] focus:ring-4 focus:ring-[#f4a261]/10 transition-all text-sm`}
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-white uppercase tracking-widest opacity-80">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-[#141414] border-2 ${password ? 'border-[#f4a261] shadow-[0_0_25px_rgba(244,162,97,0.1)]' : 'border-white/5'} rounded-2xl px-6 py-5 text-white outline-none focus:border-[#f4a261] focus:ring-4 focus:ring-[#f4a261]/10 transition-all text-sm`}
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#f4a261] hover:bg-white text-black py-6 mt-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#f4a261]/10 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      'Initialize Membership'
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md p-1 bg-[#0d0d0d] rounded-[2.5rem] shadow-[0_0_100px_rgba(244,162,97,0.1)] border border-[#f4a261]/20 overflow-hidden"
            >
              <div className="relative p-12 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#f4a261]/5 blur-[100px] -z-10" />
                
                <div className="mx-auto w-24 h-24 rounded-full bg-[#f4a261]/10 flex items-center justify-center text-5xl mb-8 border border-[#f4a261]/20 shadow-[0_0_30px_rgba(244,162,97,0.1)]">
                  💎
                </div>
                <h1 className="text-5xl font-black text-white mb-4 tracking-tighter italic">Interested?</h1>
                <p className="text-white/40 mb-10 leading-relaxed text-sm">
                  You're one step away from joining the elite network. Unlock full access to the private War Room and founder tools.
                </p>
                
                <div className="bg-[#141414] rounded-3xl p-8 mb-10 border border-white/5 text-left relative overflow-hidden group hover:border-[#f4a261]/30 transition-colors">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#f4a261] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-2xl">
                    Early Access
                  </div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f4a261]">Growth Seat</p>
                      <h3 className="text-3xl font-black text-white mt-1 tracking-tight">Operator</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-black text-white tracking-tighter">$20</span>
                      <span className="text-xs font-medium text-white/40 ml-1">/mo</span>
                    </div>
                  </div>
                  <ul className="space-y-4 text-xs text-white/60">
                    <li className="flex items-center gap-4">
                      <span className="h-5 w-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-[10px] border border-green-500/20">✓</span> 
                      Full War Room Access
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="h-5 w-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-[10px] border border-green-500/20">✓</span> 
                      Real-time SaaS Benchmarks
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="h-5 w-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-[10px] border border-green-500/20">✓</span> 
                      Private Trade Channels
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={handleFinalJoin}
                  disabled={loading}
                  className="w-full bg-[#f4a261] hover:bg-white text-black py-6 rounded-2xl font-black text-xl shadow-2xl shadow-[#f4a261]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                >
                  {loading ? (
                    <div className="h-7 w-7 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Pay Now & Join Hub
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </button>
                
                <p className="mt-8 text-[11px] text-white/30 font-medium leading-relaxed">
                  Legacy rate of $20/mo expires April 1st. <br/>
                  <span className="text-white/50">Prices will rise to $35/mo for new members.</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

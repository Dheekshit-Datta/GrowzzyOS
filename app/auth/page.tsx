"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Layers, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || (!isLogin && !name)) return

    setIsLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          console.error(error)
          alert(error.message)
          return
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        })
        if (error) {
          console.error(error)
          alert(error.message)
          return
        }
        if (!data.user) {
          alert("Check your email to confirm your account.")
          return
        }
      }

      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#f7f5f3] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#37322f] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xl">
            <span className="font-semibold">GROWZZY</span>
            <span className="font-light opacity-60"> OS</span>
          </span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl text-white leading-tight font-serif font-normal">
            All your marketing channels, <span className="text-[#f97316] italic">one intelligent dashboard</span>
          </h1>
          <p className="text-white/60 text-lg font-normal">
            Unify Meta Ads, Google Ads, Shopify & LinkedIn with AI-driven insights.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {["S", "M", "R", "A"].map((letter, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/10 border-2 border-[#37322f] flex items-center justify-center text-sm text-white"
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-sm">
              Trusted by <span className="text-white">500+</span> marketing teams
            </p>
          </div>
        </div>

        <p className="text-white/40 text-sm">© 2025 GROWZZY. All rights reserved.</p>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile Logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#37322f] rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#37322f] text-xl">
            <span className="font-semibold">GROWZZY</span>
            <span className="font-light opacity-60"> OS</span>
          </span>
        </Link>

        <Link
          href="/"
          className="absolute top-6 left-6 lg:left-auto lg:right-6 flex items-center gap-2 text-[#37322f]/60 hover:text-[#37322f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>

        <div className="w-full max-w-[400px]">
          <div className="text-center mb-8">
            <h2 className="text-2xl text-[#37322f] mb-2 font-serif">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-[#37322f]/60 font-normal">
              {isLogin ? "Sign in to access your marketing dashboard" : "Start managing your campaigns with AI"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm text-[#37322f]/70">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37322f]/40" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 pl-11 bg-white border-[#37322f]/10 text-[#37322f] placeholder:text-[#37322f]/40 rounded-xl focus:border-[#f97316]/30 focus:ring-[#f97316]/10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-[#37322f]/70">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37322f]/40" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-11 bg-white border-[#37322f]/10 text-[#37322f] placeholder:text-[#37322f]/40 rounded-xl focus:border-[#f97316]/30 focus:ring-[#f97316]/10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-[#37322f]/70">Password</label>
                {isLogin && (
                  <button type="button" className="text-sm text-[#f97316] hover:text-[#ea580c]">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37322f]/40" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-11 pr-11 bg-white border-[#37322f]/10 text-[#37322f] placeholder:text-[#37322f]/40 rounded-xl focus:border-[#f97316]/30 focus:ring-[#f97316]/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#37322f]/40 hover:text-[#37322f]/60"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#37322f] hover:bg-[#37322f]/90 text-white rounded-xl transition-all shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Please wait...</span>
                </div>
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#37322f]/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f7f5f3] px-3 text-[#37322f]/40">or continue in demo mode</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="col-span-2 h-12 flex items-center justify-center gap-2 bg-white border border-[#37322f]/10 rounded-xl hover:bg-[#f7f5f3] hover:border-[#37322f]/20 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-[#37322f] text-white flex items-center justify-center text-xs">
                D
              </span>
              <span className="text-sm text-[#37322f]">Skip sign-in and view demo dashboard</span>
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-[#37322f]/60">
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setEmail("")
                setPassword("")
                setName("")
              }}
              className="text-[#f97316] hover:text-[#ea580c]"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>

          <div className="mt-6 rounded-xl bg-white border border-[#37322f]/10 p-4">
            <p className="text-sm text-[#37322f]/70 text-center">
              <span className="text-[#f97316]">Demo Mode:</span> Use any email and password to access the dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

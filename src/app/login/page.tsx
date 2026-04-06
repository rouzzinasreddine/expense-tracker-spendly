"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SpendlyLogo } from "@/components/ui/SpendlyLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e141a] flex">
      {/* Left Description Side */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 bg-[#0a0f14] relative overflow-hidden border-r border-slate-800/50">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#8083ff] rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#494bd6] rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="mb-8">
             <SpendlyLogo size={64} withText={false} />
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
            Master your money with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0c1ff] to-[#8083ff]">Spendly</span>.
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-8 font-medium">
            The ultimate personal finance ledger designed to bring clarity to your spending. Track expenses, balance your budget, and achieve your financial goals with precision.
          </p>
          <div className="flex items-center gap-4 text-sm font-semibold text-slate-300">
            <div className="flex items-center gap-2 bg-[#1b2027] px-4 py-2 rounded-lg border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Secure
            </div>
            <div className="flex items-center gap-2 bg-[#1b2027] px-4 py-2 rounded-lg border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Fast
            </div>
            <div className="flex items-center gap-2 bg-[#1b2027] px-4 py-2 rounded-lg border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> Insightful
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-[480px] xl:w-[560px] flex items-center justify-center p-6 lg:p-12 relative bg-[#0e141a]">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <SpendlyLogo size={56} withText={true} />
          </div>
          
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign In</h2>
            <p className="text-slate-400 text-sm mt-2">Welcome back to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center lg:text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1b2027] border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] transition-all"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1b2027] border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8083ff] to-[#494bd6] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-[#c0c1ff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center lg:text-left text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#c0c1ff] hover:text-white transition-colors font-medium">
              Create an account
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <p className="text-xs text-slate-500 text-center lg:text-left">
              Demo: <span className="font-mono text-slate-300">demo@spendly.com</span> /{" "}
              <span className="font-mono text-slate-300">demo1234</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// Force cache invalidation

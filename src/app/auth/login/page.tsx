"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Lock, Mail, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      <Header />
      
      {/* --- PREMIUM BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0">
        {/* Animated Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-600/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-white/5 blur-[100px] rounded-full"
        />

        {/* Cyber Grid Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', size: '50px 50px', backgroundSize: '60px 60px' }} 
        />

        {/* Big Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
           <span className="text-[35vw] font-black italic text-white/[0.02] uppercase leading-none tracking-tighter">NIKE</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-black/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="flex flex-col items-center mb-10">
             <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(220,38,38,0.4)]">
                <User className="text-white w-8 h-8" />
             </div>
             <h1 className="text-3xl font-black uppercase tracking-widest text-center">Connexion</h1>
             <p className="text-gray-400 text-[10px] font-black uppercase tracking-[4px] mt-2">Accédez à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-600 transition-colors" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-red-600/50 focus:bg-white/10 transition-all text-sm placeholder:text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-600 transition-colors" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-red-600/50 focus:bg-white/10 transition-all text-sm placeholder:text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-white transition-colors">
                Mot de passe oublié ?
              </button>
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[4px] text-xs hover:bg-red-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 mt-4"
            >
              Se connecter
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
              Pas encore de compte ?
            </p>
            <Link href="/auth/register" className="inline-block mt-3 text-[11px] font-black uppercase tracking-widest text-white hover:text-red-600 transition-colors border-b border-white/20 pb-1">
              Créer un compte client
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

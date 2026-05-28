"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  ExternalLink,
  ChevronRight,
  Zap,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Produits", icon: Package },
  { id: "categories", label: "Catégories", icon: Tag },
  { id: "orders", label: "Commandes", icon: ShoppingCart },
];

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col"
      style={{
        background: "linear-gradient(160deg, #0f0c1d 0%, #1a0a3c 40%, #2d1660 70%, #3b0764 100%)",
      }}
    >
      {/* Déco blob */}
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}
      />

      {/* Logo */}
      <div className="px-8 pt-8 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none tracking-tight">YOOTA</p>
            <p className="text-violet-300/60 text-[9px] font-bold uppercase tracking-[3px] mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="text-violet-300/40 text-[9px] font-black uppercase tracking-[3px] px-4 mb-4">Menu Principal</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 group relative ${
                isActive
                  ? "bg-white/15 text-white shadow-lg shadow-black/20"
                  : "text-violet-300/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-2xl bg-white/10 border border-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className={`w-4.5 h-4.5 relative z-10 transition-all ${isActive ? "text-violet-300" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="relative z-10 text-sm font-bold tracking-wide">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-violet-300/60 relative z-10 ml-auto" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Retour boutique */}
      <div className="px-4 pb-8">
        <div className="border-t border-white/5 pt-6">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-violet-300/50 hover:text-white hover:bg-white/5 transition-all duration-200 group"
          >
            <ExternalLink className="w-4 h-4 group-hover:text-violet-300" />
            <span className="text-sm font-bold">Voir la Boutique</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

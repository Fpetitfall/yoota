"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Euro, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  delay: number;
}

function StatCard({ icon: Icon, label, value, color, bgColor, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 cursor-default"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${bgColor}`}>
        <Icon className={`w-6 h-6 ${color}`} strokeWidth={2} />
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[3px] mb-1">{label}</p>
        <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    categories: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: productCount }, { count: orderCount }, { data: orders }, { count: catCount }] =
        await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("total_amount").eq("payment_status", "paid"),
          supabase.from("product_categories").select("*", { count: "exact", head: true }),
        ]);

      const revenue = (orders || []).reduce(
        (acc: number, o: any) => acc + (o.total_amount || 0),
        0
      );

      setStats({
        products: productCount || 0,
        orders: orderCount || 0,
        revenue,
        categories: catCount || 0,
      });
    };
    fetchStats();
  }, [supabase]);

  const cards = [
    {
      icon: Package,
      label: "Produits",
      value: stats.products,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      delay: 0,
    },
    {
      icon: ShoppingCart,
      label: "Commandes",
      value: stats.orders,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      delay: 0.1,
    },
    {
      icon: Euro,
      label: "Revenus (€)",
      value: stats.revenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }),
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      delay: 0.2,
    },
    {
      icon: Tag,
      label: "Catégories",
      value: stats.categories,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      delay: 0.3,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

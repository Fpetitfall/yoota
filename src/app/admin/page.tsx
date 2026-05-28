"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Bell,
  Search,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatsSection from "@/components/admin/StatsSection";
import ProductListTab from "@/components/admin/ProductListTab";
import CategoryListTab from "@/components/admin/CategoryListTab";
import OrdersListTab from "@/components/admin/OrdersListTab";

const TAB_CONFIG: Record<string, { label: string; icon: React.ElementType; description: string }> = {
  dashboard: {
    label: "Vue d'ensemble",
    icon: LayoutDashboard,
    description: "Statistiques et aperçu global de votre boutique",
  },
  products: {
    label: "Gestion Produits",
    icon: Package,
    description: "Ajoutez, modifiez ou supprimez vos produits du catalogue",
  },
  categories: {
    label: "Gestion Catégories",
    icon: Tag,
    description: "Organisez vos produits par catégories et genres",
  },
  orders: {
    label: "Suivi Commandes",
    icon: ShoppingCart,
    description: "Consultez l'historique des achats de vos clients",
  },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #0f0c1d 0%, #1a0a3c 50%, #2d1660 100%)" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-violet-500/30 border-t-violet-400"
        />
      </div>
    );
  }

  const currentTab = TAB_CONFIG[activeTab];
  const TabIcon = currentTab.icon;

  return (
    <div className="min-h-screen bg-gray-50/70 flex">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenu principal */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* Header Admin */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Recherche rapide..."
              className="pl-11 pr-6 py-2.5 bg-gray-100 rounded-full text-sm font-medium outline-none focus:bg-gray-200 transition-all w-72"
            />
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative">
              <Bell className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black text-gray-900 leading-none">
                  {user?.user_metadata?.full_name || "Admin"}
                </p>
                <p className="text-[9px] text-gray-400 font-medium mt-0.5 truncate max-w-32">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <main className="flex-1 p-8">
          {/* Titre de l'onglet actif */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <TabIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900">{currentTab.label}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{currentTab.description}</p>
            </div>
          </motion.div>

          {/* Vue d'ensemble : Stats + aperçu produits */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  <StatsSection />

                  {/* Accès rapides */}
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-5">Accès Rapides</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {[
                        {
                          id: "products",
                          title: "Ajouter un Produit",
                          desc: "Insérez une nouvelle paire dans votre catalogue Yoota.",
                          icon: Package,
                          color: "from-violet-500 to-purple-700",
                        },
                        {
                          id: "categories",
                          title: "Gérer les Catégories",
                          desc: "Créez ou supprimez des catégories liées aux menus.",
                          icon: Tag,
                          color: "from-orange-400 to-pink-500",
                        },
                        {
                          id: "orders",
                          title: "Voir les Commandes",
                          desc: "Consultez les achats récents de vos clients.",
                          icon: ShoppingCart,
                          color: "from-blue-500 to-cyan-500",
                        },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white rounded-3xl p-6 text-left border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-100 transition-all duration-300"
                          >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-black text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dernières commandes récentes */}
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-5">Activité Récente</h2>
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <OrdersListTab />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "products" && <ProductListTab />}
              {activeTab === "categories" && <CategoryListTab />}
              {activeTab === "orders" && <OrdersListTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

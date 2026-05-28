"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, RefreshCw, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const STATUS_CONFIG: Record<string, { icon: React.ElementType; label: string; bg: string; text: string; dot: string }> = {
  paid: {
    icon: CheckCircle2,
    label: "Payé",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  pending: {
    icon: Clock,
    label: "En attente",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  failed: {
    icon: XCircle,
    label: "Échoué",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
  },
};

function OrderRow({ order, index }: { order: any; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const status = STATUS_CONFIG[order.payment_status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  const loadItems = async () => {
    if (items.length > 0) { setExpanded(!expanded); return; }
    setLoadingItems(true);
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);
    setItems(data || []);
    setLoadingItems(false);
    setExpanded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border border-gray-100 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={loadItems}
        className="w-full flex items-center gap-4 p-5 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        {/* Numéro commande */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <ShoppingCart className="w-4 h-4 text-gray-400" />
        </div>

        {/* Client */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 truncate">{order.customer_name}</p>
          <p className="text-xs text-gray-400 truncate">{order.customer_email}</p>
        </div>

        {/* Adresse */}
        <div className="hidden md:block flex-1 min-w-0">
          <p className="text-xs text-gray-500 truncate">{order.shipping_address}</p>
          <p className="text-xs text-gray-400">{order.city}</p>
        </div>

        {/* Méthode paiement */}
        <div className="hidden sm:block flex-shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
            {order.payment_method === "stripe" ? "💳 Stripe" : order.payment_method === "paypal" ? "🅿 PayPal" : order.payment_method}
          </span>
        </div>

        {/* Total */}
        <div className="flex-shrink-0 text-right">
          <p className="font-black text-base text-gray-900">
            {Number(order.total_amount).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </p>
          <p className="text-[9px] text-gray-400">
            {new Date(order.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>

        {/* Statut */}
        <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${status.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${status.text}`}>{status.label}</span>
        </div>

        {/* Expand */}
        <div className="flex-shrink-0 text-gray-400">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Articles détail */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-gray-50 border-t border-gray-100 px-5 py-4"
        >
          {loadingItems ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-violet-500 rounded-full animate-spin" />
              Chargement des articles...
            </div>
          ) : items.length === 0 ? (
            <p className="text-xs text-gray-400">Aucun article enregistré pour cette commande.</p>
          ) : (
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 mb-3">Articles commandés</p>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl p-3">
                  {item.product_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 truncate">{item.product_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.color && (
                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                          <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.color }} />
                        </span>
                      )}
                      {item.size && <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.size}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                    <p className="font-black text-sm text-gray-900">
                      {(item.price * item.quantity).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function OrdersListTab() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Tous");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = orders.filter((o) =>
    filterStatus === "Tous" ? true : o.payment_status === filterStatus.toLowerCase()
  );

  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((acc, o) => acc + o.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {["Tous", "Paid", "Pending", "Failed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filterStatus === s
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                  : "bg-white text-gray-500 border border-gray-100 hover:border-violet-300"
              }`}
            >
              {s === "Paid" ? "✅ Payé" : s === "Pending" ? "⏳ En Attente" : s === "Failed" ? "❌ Échoué" : s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
            Total encaissé : {totalRevenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </div>
          <button
            onClick={fetchOrders}
            className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-400 font-medium">
        <span className="font-black text-gray-900">{filtered.length}</span> commande(s) affichée(s)
      </p>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingCart className="w-14 h-14 text-gray-200 mb-4" />
          <p className="text-lg font-black text-gray-400 uppercase tracking-widest">Aucune commande</p>
          <p className="text-sm text-gray-300 mt-1">Les achats de vos clients apparaîtront ici automatiquement.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => (
            <OrderRow key={order.id} order={order} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

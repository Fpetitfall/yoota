"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Star, Search, RefreshCw, Package } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import AddProductModal from "./AddProductModal";

export default function ProductListTab() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("Tous");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setProducts(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" du catalogue ?`)) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filtered = products.filter((p) => {
    const matchSearch = normalize(p.name + " " + p.category).includes(normalize(search));
    const matchGender = filterGender === "Tous" || p.gender === filterGender;
    return matchSearch && matchGender;
  });

  return (
    <>
      <AddProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchProducts}
        editProduct={editProduct}
      />

      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-5 py-3 bg-white rounded-2xl border border-gray-100 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 w-64 shadow-sm"
              />
            </div>
            {/* Filter Genre */}
            {["Tous", "Homme", "Femme", "Enfant", "Unisexe"].map((g) => (
              <button
                key={g}
                onClick={() => setFilterGender(g)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filterGender === g
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-violet-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-200"
            >
              <Plus className="w-4 h-4" />
              Ajouter un Produit
            </motion.button>
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-400 font-medium">
          <span className="font-black text-gray-900">{filtered.length}</span> produit(s) affiché(s)
        </p>

        {/* Grid de produits */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="w-14 h-14 text-gray-200 mb-4" />
            <p className="text-lg font-black text-gray-400 uppercase tracking-widest">Aucun produit trouvé</p>
            <p className="text-sm text-gray-300 mt-1">Essayez un autre filtre ou ajoutez un nouveau produit.</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-50 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-yellow-400 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                        {product.tag}
                      </span>
                    )}
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-violet-50 transition-colors shadow-lg"
                      >
                        <Pencil className="w-4 h-4 text-violet-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[9px] font-black uppercase tracking-[2px] text-violet-500 mb-1">
                      {product.gender} · {product.category}
                    </p>
                    <h3 className="font-bold text-sm text-gray-900 mb-2 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="font-black text-lg text-gray-900">
                        {Number(product.price).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{product.rating}</span>
                      </div>
                    </div>
                    {/* Couleurs */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex gap-1.5 mt-3">
                        {product.colors.slice(0, 5).map((c: string) => (
                          <div
                            key={c}
                            className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}

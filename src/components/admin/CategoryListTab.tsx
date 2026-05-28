"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Tag, RefreshCw, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Catégories pré-définies alignées sur les menus du site
const MENU_CATEGORIES = [
  // Homme
  { name: "Chaussure pour Homme", gender: "Homme", slug: "chaussure-pour-homme" },
  { name: "Chaussure de Running Homme", gender: "Homme", slug: "chaussure-running-homme" },
  { name: "Chaussure de Basket Homme", gender: "Homme", slug: "chaussure-basket-homme" },
  { name: "Chaussure de Training Homme", gender: "Homme", slug: "chaussure-training-homme" },
  { name: "Chaussure Lifestyle Homme", gender: "Homme", slug: "chaussure-lifestyle-homme" },
  // Femme
  { name: "Chaussure pour Femme", gender: "Femme", slug: "chaussure-pour-femme" },
  { name: "Chaussure de Running Femme", gender: "Femme", slug: "chaussure-running-femme" },
  { name: "Chaussure d'Entraînement Femme", gender: "Femme", slug: "chaussure-entrainement-femme" },
  { name: "Chaussure Lifestyle Femme", gender: "Femme", slug: "chaussure-lifestyle-femme" },
  // Enfant
  { name: "Chaussure Enfant", gender: "Enfant", slug: "chaussure-enfant" },
  { name: "Chaussure de Sport Enfant", gender: "Enfant", slug: "chaussure-sport-enfant" },
  // Unisexe
  { name: "Chaussure Unisexe", gender: "Unisexe", slug: "chaussure-unisexe" },
  { name: "Chaussure de Skateboard", gender: "Unisexe", slug: "chaussure-skateboard" },
];

const GENDER_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Homme: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  Femme: { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-400" },
  Enfant: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  Unisexe: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
};

export default function CategoryListTab() {
  const supabase = createClient();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGender, setNewGender] = useState("Homme");
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("product_categories").select("*").order("name");
    setCategories(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;
    await supabase.from("product_categories").delete().eq("id", id);
    fetchCategories();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError(null);

    const slug = newName.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const { error: insertError } = await supabase
      .from("product_categories")
      .insert({ name: newName.trim(), slug });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("Cette catégorie existe déjà.");
      } else {
        setError(insertError.message);
      }
    } else {
      setNewName("");
      fetchCategories();
    }
    setAdding(false);
  };

  const handleQuickAdd = async (cat: typeof MENU_CATEGORIES[0]) => {
    const { error: insertError } = await supabase
      .from("product_categories")
      .insert({ name: cat.name, slug: cat.slug });

    if (!insertError) fetchCategories();
  };

  // Filtrer les suggestions non encore ajoutées
  const existingNames = categories.map((c) => c.name);
  const suggestions = MENU_CATEGORIES.filter((m) => !existingNames.includes(m.name));

  // Grouper par genre
  const grouped = categories.reduce((acc: Record<string, any[]>, cat) => {
    // Déduire le genre depuis le nom de catégorie
    let genre = "Unisexe";
    if (cat.name.toLowerCase().includes("homme")) genre = "Homme";
    else if (cat.name.toLowerCase().includes("femme")) genre = "Femme";
    else if (cat.name.toLowerCase().includes("enfant")) genre = "Enfant";

    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(cat);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Formulaire d'ajout */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">
          Ajouter une Catégorie Personnalisée
        </h3>
        <form onSubmit={handleAdd} className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-52">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
              Nom de la catégorie
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="ex: Chaussure de Trail Homme"
              className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={adding || !newName.trim()}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-200 disabled:opacity-50 h-[52px]"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Ajouter
          </motion.button>
        </form>
        {error && (
          <p className="text-red-500 text-xs font-bold uppercase tracking-widest mt-3">{error}</p>
        )}
      </div>

      {/* Suggestions rapides (catégories alignées sur les menus) */}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-violet-500" />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
              Catégories des Menus (Ajout Rapide)
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-5">
            Ces catégories correspondent aux sections et menus de votre boutique Yoota.
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((cat) => {
              const style = GENDER_COLORS[cat.gender] || GENDER_COLORS.Unisexe;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleQuickAdd(cat)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-dashed border-gray-200 hover:border-violet-300 ${style.bg} ${style.text} transition-all`}
                >
                  <Plus className="w-3 h-3" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste des catégories existantes */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
            Catégories Enregistrées ({categories.length})
          </h3>
          <button
            onClick={fetchCategories}
            className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-bold text-sm">Aucune catégorie pour l'instant</p>
            <p className="text-gray-300 text-xs mt-1">Utilisez les suggestions ci-dessus ou ajoutez une catégorie personnalisée.</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-6">
              {(["Homme", "Femme", "Enfant", "Unisexe"] as const).map((genre) => {
                const items = grouped[genre];
                if (!items || items.length === 0) return null;
                const style = GENDER_COLORS[genre];
                return (
                  <div key={genre}>
                    <div className={`flex items-center gap-2 mb-3`}>
                      <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <p className={`text-[10px] font-black uppercase tracking-[3px] ${style.text}`}>{genre}</p>
                    </div>
                    <div className="space-y-2">
                      {items.map((cat, i) => (
                        <motion.div
                          key={cat.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Tag className="w-4 h-4 text-gray-300" />
                            <span className="text-sm font-bold text-gray-800">{cat.name}</span>
                            <span className="text-[9px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-lg border border-gray-100">
                              /{cat.slug}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

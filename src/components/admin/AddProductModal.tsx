"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ImageIcon, Loader2, Upload, Trash2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: any;
}

const GENDER_OPTIONS = [
  { value: "Homme", label: "Homme" },
  { value: "Femme", label: "Femme" },
  { value: "Enfant", label: "Enfant" },
  { value: "Unisexe", label: "Unisexe" },
];

const TAG_OPTIONS = ["Nouveauté", "Promo", "Exclusivité", "Bestseller"];

const PRESET_SIZES = {
  Homme: ["40", "41", "42", "43", "44", "45"],
  Femme: ["36", "37", "38", "39", "40", "41"],
  Enfant: ["26", "27", "28", "29", "30", "31", "32", "33", "34", "35"],
  Unisexe: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
};

const PRESET_COLORS = [
  "#000000", "#ffffff", "#ff0000", "#1a1a1a", "#c0c0c0",
  "#0000ff", "#008000", "#ff6600", "#800080", "#ffd700",
];

const ACCEPTED_FORMATS = ".jpg,.jpeg,.png,.webp";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

// Convertit un fichier image en WebP via le Canvas API
async function convertToWebP(file: File, quality: number = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context non disponible"));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Échec de la conversion WebP"));
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => reject(new Error("Impossible de charger l'image"));
    img.src = URL.createObjectURL(file);
  });
}

export default function AddProductModal({ isOpen, onClose, onSuccess, editProduct }: AddProductModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    gender: "Homme" as "Homme" | "Femme" | "Enfant" | "Unisexe",
    price: "",
    image: "",
    rating: "4.5",
    reviews: "0",
    tag: "",
    colors: [] as string[],
    sizes: [] as string[],
  });

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || "",
        category: editProduct.category || "",
        gender: editProduct.gender || "Homme",
        price: String(editProduct.price || ""),
        image: editProduct.image || "",
        rating: String(editProduct.rating || "4.5"),
        reviews: String(editProduct.reviews || "0"),
        tag: editProduct.tag || "",
        colors: editProduct.colors || [],
        sizes: editProduct.sizes || [],
      });
      if (editProduct.image) setImagePreview(editProduct.image);
    } else {
      resetForm();
    }
  }, [editProduct, isOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("product_categories").select("*").order("name");
      setCategories(data || []);
    };
    if (isOpen) fetchCategories();
  }, [isOpen, supabase]);

  const resetForm = () => {
    setForm({
      name: "", category: "", gender: "Homme", price: "", image: "",
      rating: "4.5", reviews: "0", tag: "", colors: [], sizes: [],
    });
    setError(null);
    setImagePreview(null);
    setImageFile(null);
  };

  const toggleColor = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // Gestion du fichier sélectionné (via clic ou drag & drop)
  const handleFileSelect = useCallback((file: File) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Format non accepté. Utilisez JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("L'image est trop lourde (max 5 Mo).");
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Upload vers Supabase Storage avec conversion WebP
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      // Conversion automatique en WebP
      const webpBlob = await convertToWebP(file);
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.webp`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, webpBlob, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Récupérer l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifications
    if (!form.name || !form.price || !form.category) {
      setError("Veuillez remplir tous les champs obligatoires (*).");
      return;
    }
    if (!imageFile && !form.image) {
      setError("Veuillez sélectionner une image pour le produit.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl = form.image;

      // Upload de la nouvelle image si un fichier a été sélectionné
      if (imageFile) {
        imageUrl = await uploadImageToSupabase(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        gender: form.gender,
        price: parseFloat(form.price),
        image: imageUrl,
        rating: parseFloat(form.rating),
        reviews: parseInt(form.reviews),
        tag: form.tag || null,
        colors: form.colors,
        sizes: form.sizes,
      };

      if (editProduct) {
        const { error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editProduct.id);
        if (updateError) throw updateError;
      } else {
        const newId = `prod_${Date.now()}`;
        const { error: insertError } = await supabase
          .from("products")
          .insert({ ...payload, id: newId });
        if (insertError) throw insertError;
      }
      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const presetSizes = PRESET_SIZES[form.gender] || PRESET_SIZES.Homme;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              style={{ pointerEvents: "auto" }}
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between p-8 pb-0">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    {editProduct ? "Modifier le Produit" : "Nouveau Produit"}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {editProduct ? "Mettez à jour les informations du produit." : "Ajoutez une nouvelle paire au catalogue Yoota."}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Nom & Prix */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Nike Air Max 270"
                      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="159.99"
                      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Genre & Tag */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                      Genre *
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value as any, sizes: [] })}
                      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer"
                    >
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                      Tag / Badge
                    </label>
                    <select
                      value={form.tag}
                      onChange={(e) => setForm({ ...form, tag: e.target.value })}
                      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer"
                    >
                      <option value="">— Aucun badge —</option>
                      {TAG_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Catégorie */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                    Catégorie *
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Chaussure pour Homme, Running Femme..."
                    list="category-suggestions"
                    className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    required
                  />
                  <datalist id="category-suggestions">
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name} />
                    ))}
                  </datalist>
                </div>

                {/* Zone d'Upload d'Image */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                    Image du produit *
                  </label>

                  {!imagePreview ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                        isDragging
                          ? "border-violet-500 bg-violet-50 scale-[1.02]"
                          : "border-gray-200 bg-gray-50/50 hover:border-violet-300 hover:bg-violet-50/30"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_FORMATS}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                          isDragging ? "bg-violet-100" : "bg-gray-100"
                        }`}>
                          <Upload className={`w-6 h-6 ${isDragging ? "text-violet-500" : "text-gray-400"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            {isDragging ? "Déposez l'image ici" : "Glissez-déposez votre image ici"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            ou <span className="text-violet-500 font-semibold">parcourez vos fichiers</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 bg-gray-100 px-2 py-1 rounded-lg">JPG</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 bg-gray-100 px-2 py-1 rounded-lg">PNG</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-50 px-2 py-1 rounded-lg">→ WEBP</span>
                        </div>
                        <p className="text-[10px] text-gray-300">Max. 5 Mo • Conversion auto en WebP</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Aperçu du produit"
                          className="w-full h-48 object-contain bg-white"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white text-gray-800 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Changer
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Supprimer
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_FORMATS}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      {imageFile && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          <span>{imageFile.name}</span>
                          <span className="text-gray-300">•</span>
                          <span>{(imageFile.size / 1024).toFixed(0)} Ko → WebP</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Couleurs */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">
                    Couleurs disponibles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                          form.colors.includes(color)
                            ? "border-violet-500 scale-110 shadow-lg shadow-violet-200"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  {form.colors.length > 0 && (
                    <p className="text-[10px] text-gray-400 mt-2">{form.colors.length} couleur(s) sélectionnée(s)</p>
                  )}
                </div>

                {/* Tailles */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">
                    Tailles disponibles — {form.gender}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {presetSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border ${
                          form.sizes.includes(size)
                            ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                      Note (0–5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: e.target.value })}
                      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                      Nombre d'avis
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.reviews}
                      onChange={(e) => setForm({ ...form, reviews: e.target.value })}
                      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest p-4 rounded-2xl">
                    {error}
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 rounded-2xl border border-gray-200 text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 py-4 rounded-2xl bg-violet-600 text-white text-sm font-black uppercase tracking-widest hover:bg-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading || uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {uploading ? "Conversion & Upload..." : loading ? "Enregistrement..." : editProduct ? "Mettre à jour" : "Ajouter le Produit"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Star, Truck, RefreshCcw, ShieldCheck, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDisplay({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [error, setError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");

  const { addToCart, openDrawer: openCartDrawer } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);

  const galleryImages = [
    product.image,
    product.image.replace("q=80", "q=79"),
    product.image.replace("q=80", "q=78"),
    product.image.replace("q=80", "q=77"),
    product.image.replace("q=80", "q=76"),
  ];

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }

    addToCart(product);
    openCartDrawer();
  };

  const toggleWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const getColorName = (hex: string | null) => {
    if (!hex) return "";
    const map: Record<string, string> = {
      "#ffffff": "Blanc",
      "#000000": "Noir",
      "#1a1a1a": "Anthracite",
      "#ff0000": "Rouge",
      "#0000ff": "Bleu",
      "#008000": "Vert",
      "#cccccc": "Gris",
      "#222222": "Noir Foncé"
    };
    return map[hex.toLowerCase()] || hex;
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-[1400px] mx-auto">
      {/* Colonne Gauche : Galerie + Réassurance */}
      <div className="lg:col-span-8 flex flex-col">
        <div className="flex flex-col-reverse md:flex-row gap-4">
          
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar w-full md:w-[80px] flex-shrink-0 snap-x py-1 md:py-0">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative w-[70px] h-[70px] md:w-20 md:h-20 bg-[#f6f6f6] rounded-md overflow-hidden flex-shrink-0 snap-center border-2 transition-colors ${
                  activeImageIndex === index ? "border-black" : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image 
                  src={img} 
                  alt={`Vue ${index + 1}`} 
                  fill 
                  className="object-cover" 
                  sizes="80px" 
                />
              </button>
            ))}
          </div>

          {/* Image Principale */}
          <div className="relative bg-[#f6f6f6] rounded-md overflow-hidden flex-1 aspect-square md:aspect-auto md:min-h-[600px]">
            {product.tag && (
              <div className="absolute top-4 right-4 z-10 bg-white px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-1 rounded-sm shadow-sm">
                {product.tag} <Star className="w-3 h-3" />
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeImageIndex}-${selectedColor}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full relative"
              >
                <Image
                  src={galleryImages[activeImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Barre de réassurance sous l'image */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#f6f6f6] rounded-md mt-4 p-4 md:p-6 gap-4 md:gap-4 md:pl-24">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 md:w-6 md:h-6 text-black flex-shrink-0" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="text-[11px] md:text-xs font-bold uppercase">Livraison Express</span>
              <span className="text-[11px] md:text-xs text-secondary">En 2-3 jours ouvrés</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCcw className="w-5 h-5 md:w-6 md:h-6 text-black flex-shrink-0" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="text-[11px] md:text-xs font-bold uppercase">Retours Gratuits</span>
              <span className="text-[11px] md:text-xs text-secondary">30 jours pour changer d'avis</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-black flex-shrink-0" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="text-[11px] md:text-xs font-bold uppercase">Paiement Sécurisé</span>
              <span className="text-[11px] md:text-xs text-secondary">100% sécurisées</span>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne Droite : Infos Produit & Actions */}
      <div className="lg:col-span-4 flex flex-col pt-2 lg:pt-0">
        <div className="mb-6">
          <h2 className="text-sm text-gray-500 uppercase tracking-wide mb-1">{product.category}</h2>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">{product.name}</h1>
          <p className="text-xl font-medium mb-3">{product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
          
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-black text-black" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews} avis)</span>
          </div>
        </div>

        {/* Sélecteur de Couleur */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase mb-3">Couleur : <span className="font-normal capitalize text-gray-600">{getColorName(selectedColor)}</span></h3>
            <div className="flex space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    setActiveImageIndex(0);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    selectedColor === color ? 'ring-1 ring-black ring-offset-2' : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1'
                  }`}
                  aria-label={`Couleur ${color}`}
                >
                  <span 
                    className="w-8 h-8 rounded-full border border-gray-200" 
                    style={{ backgroundColor: color }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sélecteur de Taille */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase">Taille :</h3>
              <button className="text-xs text-gray-500 hover:text-black">
                Guide des tailles
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setError(false);
                  }}
                  className={`py-3 border rounded-sm text-sm font-medium transition-all ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : error
                      ? 'border-red-500 text-red-500'
                      : 'border-gray-200 hover:border-black bg-white text-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2">Veuillez sélectionner une taille.</p>
            )}
          </div>
        )}

        {/* Boutons d'Action (En Ligne) */}
        <div className="flex gap-2 mb-10">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-4 bg-black text-white rounded-sm font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            AJOUTER AU PANIER
          </button>
          
          <button
            onClick={toggleWishlist}
            className={`w-14 flex items-center justify-center border rounded-sm transition-colors ${
              isFavorite ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-black bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-black text-black' : 'text-black'}`} />
          </button>
        </div>

        {/* Accordéons */}
        <div className="border-t border-gray-200">
          {/* Description */}
          <div className="border-b border-gray-200">
            <button 
              onClick={() => toggleAccordion("description")}
              className="w-full py-6 flex justify-between items-center text-left"
            >
              <span className="text-xs font-bold uppercase tracking-wider">Description</span>
              {openAccordion === "description" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {openAccordion === "description" && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-600 leading-relaxed pb-6">
                    La {product.name} offre un confort exceptionnel au quotidien. La première unité Air Max de Nike assure un amorti optimal et un style audacieux. Parfaite pour toutes vos tenues.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Détails du produit */}
          <div className="border-b border-gray-200">
            <button 
              onClick={() => toggleAccordion("details")}
              className="w-full py-6 flex justify-between items-center text-left"
            >
              <span className="text-xs font-bold uppercase tracking-wider">Détails du produit</span>
              {openAccordion === "details" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {openAccordion === "details" && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <ul className="text-sm text-gray-600 leading-relaxed pb-6 list-disc pl-5 space-y-1">
                    <li>Couleur affichée : {selectedColor || "Multicolore"}</li>
                    <li>Article : {product.id}XYZ-001</li>
                    <li>Pays/Région d'origine : Vietnam</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Livraison & Retours */}
          <div className="border-b border-gray-200">
            <button 
              onClick={() => toggleAccordion("shipping")}
              className="w-full py-6 flex justify-between items-center text-left"
            >
              <span className="text-xs font-bold uppercase tracking-wider">Livraison & Retours</span>
              {openAccordion === "shipping" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          {/* Avis */}
          <div className="border-b border-gray-200">
            <button 
              onClick={() => toggleAccordion("reviews")}
              className="w-full py-6 flex justify-between items-center text-left"
            >
              <span className="text-xs font-bold uppercase tracking-wider">Avis ({product.reviews})</span>
              {openAccordion === "reviews" ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

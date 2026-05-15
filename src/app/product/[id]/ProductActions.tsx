"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductActions({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null);
  const [error, setError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addToCart, openDrawer: openCartDrawer } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }

    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      openCartDrawer();
    }, 1000);
  };

  const toggleWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Sélecteur de Couleur */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-sm uppercase tracking-widest mb-3">Couleur sélectionnée</h3>
          <div className="flex space-x-3">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedColor === color ? 'border-black scale-110' : 'border-transparent hover:scale-105'
                }`}
                aria-label={`Couleur ${color}`}
              >
                <span 
                  className="w-8 h-8 rounded-full border border-black/10 shadow-sm flex items-center justify-center" 
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && color === "#ffffff" && <Check className="w-4 h-4 text-black" />}
                  {selectedColor === color && color !== "#ffffff" && <Check className="w-4 h-4 text-white" />}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sélecteur de Taille */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm uppercase tracking-widest">Sélectionner une taille</h3>
            <button className="text-xs text-secondary underline underline-offset-4 hover:text-black">
              Guide des tailles
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setError(false);
                }}
                className={`py-3 border rounded-xl text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-black bg-black text-white shadow-md'
                    : error
                    ? 'border-red-500 text-red-500'
                    : 'border-border hover:border-black'
                }`}
              >
                EU {size}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-xs font-medium mt-3"
              >
                Veuillez sélectionner une taille.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Boutons d'Action */}
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleAddToCart}
          className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition-all ${
            addedToCart 
              ? 'bg-green-500 text-white scale-[0.98]' 
              : 'bg-black text-white hover:bg-brand-volt hover:text-black active:scale-[0.98]'
          }`}
        >
          {addedToCart ? (
            <>
              <Check className="w-5 h-5" />
              <span>Ajouté !</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Ajouter au panier</span>
            </>
          )}
        </button>
        
        <button
          onClick={toggleWishlist}
          className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-2 border-2 transition-all active:scale-[0.98] ${
            isFavorite 
              ? 'border-red-500 text-red-500 bg-red-50' 
              : 'border-border text-black hover:border-black'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
          <span>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
        </button>
      </div>
    </div>
  );
}

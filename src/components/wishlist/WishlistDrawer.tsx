"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const WishlistDrawer = () => {
  const { wishlist, removeFromWishlist, isDrawerOpen, closeDrawer } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                <Heart className="w-5 h-5 fill-black" />
                Favoris ({wishlist.length})
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-accent rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items */}
            {wishlist.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
                <Heart className="w-16 h-16 text-border" />
                <div className="text-center">
                  <p className="font-black text-lg uppercase tracking-tighter">Aucun favori</p>
                  <p className="text-secondary text-sm font-medium mt-1">Ajoutez les articles que vous aimez.</p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="bg-black text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black/80 transition-all"
                >
                  Découvrir les nouveautés
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 hide-scrollbar">
                  {wishlist.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="flex gap-4 pb-6 border-b border-border/50 last:border-0"
                    >
                      {/* Image */}
                      <Link href="/" onClick={closeDrawer} className="relative w-24 h-24 bg-accent rounded-xl overflow-hidden flex-shrink-0 cursor-pointer block">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <Link href="/" onClick={closeDrawer}>
                            <h3 className="font-bold text-sm tracking-tight truncate hover:underline underline-offset-4">{item.name}</h3>
                          </Link>
                          <p className="text-secondary text-xs font-medium">{item.category}</p>
                          <p className="font-black text-sm mt-1">
                            {item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="text-xs font-bold uppercase tracking-widest bg-accent hover:bg-black hover:text-white px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Ajouter
                          </button>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="self-start p-1.5 text-secondary hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-6 py-6 space-y-5 bg-white">
                  <button
                    onClick={closeDrawer}
                    className="block w-full bg-black text-white py-4 rounded-full font-black text-sm text-center uppercase tracking-widest hover:bg-black/90 transition-all active:scale-[0.98]"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;

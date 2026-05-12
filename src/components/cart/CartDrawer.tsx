"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, isDrawerOpen, closeDrawer } = useCart();

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
              <h2 className="text-lg font-black uppercase tracking-tighter">
                Mon Panier ({cart.length})
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-accent rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
                <ShoppingBag className="w-16 h-16 text-border" />
                <div className="text-center">
                  <p className="font-black text-lg uppercase tracking-tighter">Panier vide</p>
                  <p className="text-secondary text-sm font-medium mt-1">Ajoutez des articles pour commencer.</p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="bg-black text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black/80 transition-all"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 hide-scrollbar">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="flex gap-4 pb-6 border-b border-border/50 last:border-0"
                    >
                      {/* Image */}
                      <div className="relative w-24 h-24 bg-accent rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-bold text-sm tracking-tight truncate">{item.name}</h3>
                          <p className="text-secondary text-xs font-medium">{item.category}</p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-black/10 rounded-full px-3 py-1 space-x-4">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="hover:opacity-50 transition-opacity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-sm w-3 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="hover:opacity-50 transition-opacity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="font-black text-sm">
                            {(item.price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </p>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="self-start p-1.5 text-secondary hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-6 py-6 space-y-5 bg-white">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary font-medium">Sous-total</span>
                    <span className="font-bold">{totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary font-medium">Livraison</span>
                    <span className="text-green-600 font-bold text-[10px] uppercase">Gratuit</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="font-black text-lg tracking-tighter">Total</span>
                    <span className="font-black text-lg tracking-tighter">{totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                  </div>

                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="block w-full bg-black text-white py-4 rounded-full font-black text-sm text-center uppercase tracking-widest hover:bg-black/90 transition-all active:scale-[0.98]"
                  >
                    Voir le panier
                  </Link>
                  <button
                    onClick={closeDrawer}
                    className="block w-full text-center text-[11px] font-bold uppercase tracking-widest text-secondary hover:text-black transition-colors"
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

export default CartDrawer;

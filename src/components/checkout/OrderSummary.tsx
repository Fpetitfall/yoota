"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

const OrderSummary = () => {
  const { cart, totalPrice } = useCart();
  const shipping = 0; // Livraison offerte pour le premium
  const tax = totalPrice * 0.2; // Simulation TVA

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm h-fit sticky top-24">
      <h3 className="text-xl font-black uppercase tracking-tighter mb-8 pb-4 border-b border-gray-50">
        Récapitulatif
      </h3>

      <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
        {cart.map((item) => (
          <div key={`${item.id}-${item.sizes?.[0]}`} className="flex gap-4">
            <div className="relative w-20 h-20 bg-accent rounded-2xl overflow-hidden flex-shrink-0">
              <Image 
                src={item.image} 
                alt={item.name} 
                fill 
                className="object-cover" 
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm uppercase truncate">{item.name}</p>
              <p className="text-xs text-secondary mt-1">Qté: {item.quantity}</p>
              <p className="font-bold text-sm mt-1">{item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-50">
        <div className="flex justify-between text-sm">
          <span className="text-secondary font-medium">Sous-total</span>
          <span className="font-bold">{totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary font-medium">Livraison</span>
          <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">Offerte</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary font-medium">TVA (20%)</span>
          <span className="font-bold">{tax.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
        </div>
        
        <div className="pt-6 border-t border-black/5 mt-6">
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-black uppercase tracking-tighter">Total</span>
            <span className="text-2xl font-black text-black">
              {totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest leading-relaxed">
            Paiement 100% sécurisé et protégé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

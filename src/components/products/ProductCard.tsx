"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square bg-accent overflow-hidden mb-4 rounded-2xl">
        {product.tag && (
          <span className="absolute top-4 left-4 z-10 bg-brand-volt px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm text-black">
            {product.tag}
          </span>
        )}
        <button
          className="absolute top-4 right-4 z-10 p-2 bg-white/0 hover:bg-white/100 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-primary"
            }`}
          />
        </button>
        
        {/* Quick Add Button */}
        <div className="absolute inset-x-4 bottom-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full bg-white text-black py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-volt transition-colors shadow-xl"
          >
            Ajouter au panier
          </button>
        </div>

        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
        />
      </div>

      <div className="space-y-2 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start">
          <h3 className="font-bold text-xl lg:text-base group-hover:underline underline-offset-4 decoration-1 tracking-tight">
            {product.name}
          </h3>
        </div>
        <p className="text-secondary text-base lg:text-sm">{product.category}</p>
        <div className="flex items-center justify-center lg:justify-start space-x-1 text-base lg:text-sm pt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 lg:w-3 lg:h-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-primary text-primary"
                    : "text-border"
                }`}
              />
            ))}
          </div>
          <span className="text-secondary">({product.reviews})</span>
        </div>
        <p className="font-bold text-2xl lg:text-lg pt-1">{product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;

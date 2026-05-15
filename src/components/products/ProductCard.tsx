"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mobileCartAdded, setMobileCartAdded] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);

  const handleMobileAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setMobileCartAdded(true);
    setTimeout(() => setMobileCartAdded(false), 1200);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut",
        layout: { duration: 0.4, type: "spring", stiffness: 200, damping: 25 }
      }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-accent overflow-hidden mb-4 rounded-2xl">
          {product.tag && (
            <span className="absolute top-4 left-4 z-10 bg-brand-volt px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm text-black">
              {product.tag}
            </span>
          )}
          <button
            className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 shadow-sm ${
              isFavorite ? "opacity-100 bg-white" : "opacity-0 group-hover:opacity-100 bg-white/0 hover:bg-white/100"
            }`}
            onClick={toggleWishlist}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-primary"
              }`}
            />
          </button>
          
          {/* Quick Add Button — Desktop (hover) */}
          <div className="hidden lg:block absolute inset-x-4 bottom-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              className="w-full bg-white text-black py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-volt transition-colors shadow-xl"
            >
              Ajouter au panier
            </button>
          </div>

          {/* Quick Add Icon — Mobile only */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleMobileAddToCart}
            className={`lg:hidden absolute bottom-3 right-3 z-10 p-2.5 rounded-full shadow-lg transition-all duration-300 ${
              mobileCartAdded
                ? "bg-green-500 text-white"
                : "bg-white text-black active:bg-brand-volt"
            }`}
            aria-label="Ajouter au panier"
          >
            <ShoppingBag className="w-4.5 h-4.5" strokeWidth={2.5} />
          </motion.button>

          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
      </Link>
    </motion.div>
  );
};

export default ProductCard;

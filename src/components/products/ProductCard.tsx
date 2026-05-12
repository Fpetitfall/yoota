"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Product } from "@/types";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square bg-accent overflow-hidden mb-4">
        {product.tag && (
          <span className="absolute top-4 left-4 z-10 bg-brand-volt px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm text-black">
            {product.tag}
          </span>
        )}
        <button
          className="absolute top-4 right-4 z-10 p-2 bg-white/0 hover:bg-white/100 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
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
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
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

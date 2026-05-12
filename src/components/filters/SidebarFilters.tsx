"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b py-6">
      <button
        className="flex items-center justify-between w-full font-medium text-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarFilters = () => {
  return (
    <aside className="hidden lg:block w-64 pr-8 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Nike Air Max</h2>
        <span className="text-secondary text-sm">(56 produits)</span>
      </div>

      <FilterSection title="Sexe">
        <div className="flex items-center space-x-3">
          <input type="checkbox" id="homme" className="w-5 h-5 border-border rounded focus:ring-primary accent-primary cursor-pointer" />
          <label htmlFor="homme" className="cursor-pointer">Homme</label>
        </div>
        <div className="flex items-center space-x-3">
          <input type="checkbox" id="femme" className="w-5 h-5 border-border rounded focus:ring-primary accent-primary cursor-pointer" />
          <label htmlFor="femme" className="cursor-pointer">Femme</label>
        </div>
        <div className="flex items-center space-x-3">
          <input type="checkbox" id="enfant" className="w-5 h-5 border-border rounded focus:ring-primary accent-primary cursor-pointer" />
          <label htmlFor="enfant" className="cursor-pointer">Enfant</label>
        </div>
      </FilterSection>

      <FilterSection title="Catégorie">
        <div className="flex items-center space-x-3">
          <input type="checkbox" id="lifestyle" className="w-5 h-5 border-border rounded focus:ring-primary accent-primary cursor-pointer" />
          <label htmlFor="lifestyle" className="cursor-pointer">Lifestyle</label>
        </div>
        <div className="flex items-center space-x-3">
          <input type="checkbox" id="running" className="w-5 h-5 border-border rounded focus:ring-primary accent-primary cursor-pointer" />
          <label htmlFor="running" className="cursor-pointer">Running</label>
        </div>
        <div className="flex items-center space-x-3">
          <input type="checkbox" id="training" className="w-5 h-5 border-border rounded focus:ring-primary accent-primary cursor-pointer" />
          <label htmlFor="training" className="cursor-pointer">Entraînement</label>
        </div>
      </FilterSection>

      <FilterSection title="Prix">
        <div className="flex items-center space-x-3">
          <input type="radio" name="price" id="p1" className="w-5 h-5 border-border focus:ring-primary accent-primary cursor-pointer" />
          <label htmlFor="p1" className="cursor-pointer">Moins de 75 €</label>
        </div>
        <div className="flex items-center space-x-3">
          <input type="radio" name="price" id="p2" className="w-5 h-5 border-border focus:ring-primary accent-primary cursor-pointer" />
          <label htmlFor="p2" className="cursor-pointer">75 € - 120 €</label>
        </div>
        <div className="flex items-center space-x-3">
          <input type="radio" name="price" id="p3" className="w-5 h-5 border-border focus:ring-primary accent-primary cursor-pointer" />
          <label htmlFor="p3" className="cursor-pointer">120 € - 160 €</label>
        </div>
        <div className="flex items-center space-x-3">
          <input type="radio" name="price" id="p4" className="w-5 h-5 border-border focus:ring-primary accent-primary cursor-pointer" />
          <label htmlFor="p4" className="cursor-pointer">Plus de 160 €</label>
        </div>
      </FilterSection>

      <FilterSection title="Couleur">
        <div className="grid grid-cols-3 gap-2">
          {['#000000', '#ffffff', '#ff0000', '#0000ff', '#ffff00', '#008000', '#ffa500', '#800080', '#a52a2a'].map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Taille">
        <div className="grid grid-cols-3 gap-2">
          {['38', '39', '40', '41', '42', '43', '44', '45'].map((size) => (
            <button
              key={size}
              className="py-2 border border-border rounded text-sm hover:border-primary transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
};

export default SidebarFilters;

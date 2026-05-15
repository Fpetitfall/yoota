"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

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

const SidebarFilters = ({ isMobile = false }: { isMobile?: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string, isMultiple: boolean = true) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (isMultiple) {
      const current = params.get(key)?.split(",") || [];
      if (current.includes(value)) {
        const updated = current.filter(v => v !== value);
        if (updated.length > 0) {
          params.set(key, updated.join(","));
        } else {
          params.delete(key);
        }
      } else {
        current.push(value);
        params.set(key, current.join(","));
      }
    } else {
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const isChecked = (key: string, value: string) => {
    return (searchParams.get(key)?.split(",") || []).includes(value);
  };

  const isRadioChecked = (key: string, value: string) => {
    return searchParams.get(key) === value;
  };

  return (
    <aside className={isMobile ? "w-full pb-8" : "hidden lg:block w-64 pr-8 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar"}>
      {!isMobile && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Filtres</h2>
          <button 
            onClick={() => router.push('/', { scroll: false })}
            className="text-primary text-sm font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            Effacer tous les filtres
          </button>
        </div>
      )}

      {isMobile && (
        <div className="mb-4">
          <button 
            onClick={() => router.push('/', { scroll: false })}
            className="w-full py-2 border border-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            Effacer tous les filtres
          </button>
        </div>
      )}

      <FilterSection title="Sexe" defaultOpen={!isMobile}>
        {['Homme', 'Femme', 'Enfant'].map((gender) => (
          <div key={gender} className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              id={`gender-${gender}`} 
              checked={isChecked('gender', gender)}
              onChange={() => updateFilter('gender', gender)}
              className="w-5 h-5 border-border rounded focus:ring-primary accent-primary cursor-pointer" 
            />
            <label htmlFor={`gender-${gender}`} className="cursor-pointer">{gender}</label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Catégorie" defaultOpen={!isMobile}>
        {['Lifestyle', 'Running', 'Entraînement'].map((category) => (
          <div key={category} className="flex items-center space-x-3">
            <input 
              type="checkbox" 
              id={`cat-${category}`} 
              checked={isChecked('category', category)}
              onChange={() => updateFilter('category', category)}
              className="w-5 h-5 border-border rounded focus:ring-primary accent-primary cursor-pointer" 
            />
            <label htmlFor={`cat-${category}`} className="cursor-pointer">{category}</label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Prix" defaultOpen={!isMobile}>
        {[
          { id: 'p1', label: 'Moins de 75 €', value: 'under75' },
          { id: 'p2', label: '75 € - 120 €', value: '75-120' },
          { id: 'p3', label: '120 € - 160 €', value: '120-160' },
          { id: 'p4', label: 'Plus de 160 €', value: 'over160' },
        ].map((priceRange) => (
          <div key={priceRange.id} className="flex items-center space-x-3">
            <input 
              type="radio" 
              name={`price-${isMobile ? 'mobile' : 'desktop'}`}
              id={`${priceRange.id}-${isMobile ? 'mobile' : 'desktop'}`} 
              checked={isRadioChecked('price', priceRange.value)}
              onChange={() => updateFilter('price', priceRange.value, false)}
              className="w-5 h-5 border-border focus:ring-primary accent-primary cursor-pointer" 
            />
            <label htmlFor={`${priceRange.id}-${isMobile ? 'mobile' : 'desktop'}`} className="cursor-pointer">{priceRange.label}</label>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Couleur" defaultOpen={!isMobile}>
        <div className="grid grid-cols-3 gap-2">
          {['#000000', '#ffffff', '#ff0000', '#0000ff', '#ffff00', '#008000', '#ffa500', '#800080', '#a52a2a'].map((color) => {
            const selected = isChecked('color', color);
            return (
              <button
                key={color}
                onClick={() => updateFilter('color', color)}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform hover:scale-110 ${selected ? 'ring-2 ring-offset-2 ring-black border-transparent' : 'border-border'}`}
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Taille" defaultOpen={!isMobile}>
        <div className="grid grid-cols-3 gap-2">
          {['38', '39', '40', '41', '42', '43', '44', '45'].map((size) => {
            const selected = isChecked('size', size);
            return (
              <button
                key={size}
                onClick={() => updateFilter('size', size)}
                className={`py-2 border rounded text-sm transition-colors ${selected ? 'border-black bg-black text-white font-bold' : 'border-border hover:border-primary'}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </aside>
  );
};

export default SidebarFilters;

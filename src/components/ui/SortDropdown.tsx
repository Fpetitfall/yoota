"use client";

import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SortDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Nouveautés");

  const options = [
    "Nouveautés",
    "Prix : Croissant",
    "Prix : Décroissant",
    "Les mieux notés",
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-[11px] sm:text-xs font-bold bg-white border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300"
      >
        <span className="uppercase tracking-widest whitespace-nowrap">Trier par : {selected}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-30" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute right-0 mt-3 w-64 bg-white border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-40 p-2 rounded-2xl overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl transition-all duration-200 ${
                    selected === option
                      ? "bg-black text-white font-bold"
                      : "hover:bg-accent font-medium text-primary/80 hover:text-primary"
                  }`}
                >
                  <span>{option}</span>
                  {selected === option && <Check className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;

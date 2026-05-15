"use client";

import React, { useState } from "react";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarFilters from "./SidebarFilters";

const MobileFilterDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 lg:hidden font-bold border border-black px-4 py-2 rounded-full text-[10px] sm:text-[11px] uppercase tracking-widest whitespace-nowrap"
      >
        <span>Filtrer</span>
        <Filter className="w-3 h-3" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 w-full h-[85vh] bg-white z-[110] rounded-t-3xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <h2 className="text-lg font-black uppercase tracking-tighter">Filtres</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-accent rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar">
                <SidebarFilters isMobile={true} />
              </div>
              
              <div className="p-6 border-t border-border bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-full bg-black text-white py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-black/90 transition-all active:scale-[0.98]"
                >
                  Voir les résultats
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileFilterDrawer;

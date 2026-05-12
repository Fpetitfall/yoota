import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SidebarFilters from "@/components/filters/SidebarFilters";
import ProductGrid from "@/components/products/ProductGrid";
import SortDropdown from "@/components/ui/SortDropdown";
import { products } from "@/data/products";
import { ChevronRight, Filter } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-[12px] text-secondary mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <span>Accueil</span>
            <ChevronRight className="w-3 h-3" />
            <span>Homme</span>
            <ChevronRight className="w-3 h-3" />
            <span>Chaussures</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-medium">Nike Air Max</span>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <SidebarFilters />

            {/* Content */}
            <div className="flex-1">
              {/* Mobile Title */}
              <div className="lg:hidden text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Nike Air Max</h1>
                <span className="text-secondary text-sm">(56 produits)</span>
              </div>

              {/* Mobile Filter Toggle & Sort */}
              <div className="flex flex-wrap items-center justify-between gap-y-4 mb-8 sticky top-[64px] lg:top-auto bg-white z-20 py-4 lg:py-0 border-b lg:border-none">
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 lg:hidden font-bold border border-black px-4 py-2 rounded-full text-[10px] sm:text-[11px] uppercase tracking-widest whitespace-nowrap">
                    <span>Filtrer</span>
                    <Filter className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <SortDropdown />
                </div>
              </div>

              {/* Product Grid */}
              <ProductGrid products={products} />

              {/* Bottom Info Section */}
              <div className="mt-20 border-t pt-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 10l7 7 7-7"/></svg>
                    </div>
                    <h4 className="font-bold text-xs uppercase tracking-widest">LIVRAISON EXPRESS</h4>
                    <p className="text-secondary text-sm">Livraison en 2-3 jours ouvrés</p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 12l4-4M3 12l4 4"/></svg>
                    </div>
                    <h4 className="font-bold text-xs uppercase tracking-widest">RETOURS GRATUITS</h4>
                    <p className="text-secondary text-sm">30 jours pour changer d'avis</p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <h4 className="font-bold text-xs uppercase tracking-widest">PAIEMENT SÉCURISÉ</h4>
                    <p className="text-secondary text-sm">Transactions 100% sécurisées</p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    </div>
                    <h4 className="font-bold text-xs uppercase tracking-widest">BESOIN D'AIDE ?</h4>
                    <p className="text-secondary text-sm">Contactez-nous, on est là pour toi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

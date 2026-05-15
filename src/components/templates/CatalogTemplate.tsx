import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SidebarFilters from "@/components/filters/SidebarFilters";
import MobileFilterDrawer from "@/components/filters/MobileFilterDrawer";
import ProductGrid from "@/components/products/ProductGrid";
import SortDropdown from "@/components/ui/SortDropdown";
import Link from "next/link";
import { products } from "@/data/products";
import { Product } from "@/types";
import { ChevronRight, X } from "lucide-react";

interface CatalogTemplateProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  title: string;
  baseFilter?: (product: Product) => boolean;
  breadcrumbs: { label: string; href?: string }[];
}

export default async function CatalogTemplate({
  searchParams,
  title,
  baseFilter = () => true,
  breadcrumbs,
}: CatalogTemplateProps) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const sort = typeof params.sort === 'string' ? params.sort : 'newest';
  
  const getArrayParam = (key: string) => {
    const val = params[key];
    if (typeof val === 'string') return val.split(',');
    if (Array.isArray(val)) return val.flatMap(v => v.split(','));
    return [];
  };

  const genders = getArrayParam('gender');
  const categories = getArrayParam('category');
  const colors = getArrayParam('color');
  const sizes = getArrayParam('size');
  const price = typeof params.price === 'string' ? params.price : '';

  // Normalisation string pour la recherche
  const normalize = (str?: string) => 
    (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // On commence par filtrer par la catégorie principale (ex: Homme, Femme, Nouveautés...)
  let baseProducts = products.filter(baseFilter);

  let filteredProducts = baseProducts.filter(product => {
    // 1. Recherche par mot-clé (q)
    if (q) {
      const searchableText = normalize(
        `${product.name} ${product.category} ${product.gender} ${product.tag || ""}`
      );
      const queryTerms = normalize(q).split(/\s+/).filter(Boolean);
      if (!queryTerms.every(term => searchableText.includes(term))) return false;
    }

    // 2. Filtre Sexe (gender)
    if (genders.length > 0) {
      // On compare de manière insensible à la casse et on trim
      const productGender = product.gender.trim();
      if (!genders.some(g => g.trim().toLowerCase() === productGender.toLowerCase())) return false;
    }

    // 3. Filtre Catégorie (category)
    if (categories.length > 0) {
      const productText = normalize(`${product.name} ${product.category}`);
      const hasMatch = categories.some(cat => {
        const normalizedCat = normalize(cat.trim());
        return normalizedCat && productText.includes(normalizedCat);
      });
      if (!hasMatch) return false;
    }

    // 4. Filtre Couleur (color)
    if (colors.length > 0) {
      if (!product.colors || product.colors.length === 0) return false;
      // On compare les codes hexadécimaux
      const hasMatch = colors.some(c => 
        product.colors?.some(pc => pc.toLowerCase() === c.trim().toLowerCase())
      );
      if (!hasMatch) return false;
    }

    // 5. Filtre Taille (size)
    if (sizes.length > 0) {
      if (!product.sizes || product.sizes.length === 0) return false;
      const hasMatch = sizes.some(s => 
        product.sizes?.some(ps => ps.toString().trim() === s.trim())
      );
      if (!hasMatch) return false;
    }

    // 6. Filtre Prix (price)
    if (price) {
      const p = product.price;
      if (price === 'under75' && p >= 75) return false;
      if (price === '75-120' && (p < 75 || p > 120)) return false;
      if (price === '120-160' && (p < 120 || p > 160)) return false;
      if (price === 'over160' && p <= 160) return false;
    }

    return true;
  });

  // Tri
  filteredProducts = filteredProducts.sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; 
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-[12px] text-secondary mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-black transition-colors">{crumb.label}</Link>
                ) : (
                  <span className={idx === breadcrumbs.length - 1 && !q ? "text-primary font-medium" : ""}>
                    {crumb.label}
                  </span>
                )}
                {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3" />}
              </React.Fragment>
            ))}
            {q && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary font-medium">Recherche: {q}</span>
                <span className="mx-2 text-border">|</span>
                <Link href="?" className="text-primary flex items-center space-x-1 hover:text-black transition-colors">
                  <X className="w-3 h-3" />
                  <span className="underline underline-offset-2">Effacer</span>
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <SidebarFilters />

            {/* Content */}
            <div className="flex-1">
              {/* Mobile Title */}
              <div className="lg:hidden text-center mb-8 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-2">{q ? `Résultats pour "${q}"` : title}</h1>
                <span className="text-secondary text-sm mb-3">({filteredProducts.length} produits)</span>
                {q && (
                  <Link href="?" className="inline-flex items-center space-x-1 text-sm font-medium text-black border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                    <span>Effacer la recherche</span>
                  </Link>
                )}
              </div>

              {/* Mobile Filter Toggle & Sort */}
              <div className="flex flex-wrap items-center justify-between gap-y-4 mb-8 sticky top-[64px] lg:top-auto bg-white z-20 py-4 lg:py-0 border-b lg:border-none">
                <div className="flex items-center space-x-2">
                  <MobileFilterDrawer />
                  <div className="hidden lg:flex items-baseline space-x-2">
                    <h1 className="text-2xl font-bold">{q ? `Résultats pour "${q}"` : title}</h1>
                    <span className="text-secondary text-sm">({filteredProducts.length} produits)</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <SortDropdown />
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="text-center py-20 flex flex-col items-center">
                  <h2 className="text-2xl font-bold mb-4">Aucun produit trouvé</h2>
                  <p className="text-secondary mb-8">Essayez avec d'autres filtres ou vérifiez l'orthographe.</p>
                  <Link href="?" className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-black/80 transition-colors">
                    Effacer les filtres
                  </Link>
                </div>
              )}

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

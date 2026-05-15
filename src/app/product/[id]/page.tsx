import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChevronRight } from "lucide-react";
import ProductDisplay from "@/components/products/ProductDisplay";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  // Des produits similaires (même catégorie ou même genre, excluant le produit actuel)
  const similarProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-[11px] uppercase tracking-widest font-bold text-secondary mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${product.gender.toLowerCase()}`} className="hover:text-black transition-colors">{product.gender}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black">{product.name}</span>
          </div>

          <ProductDisplay product={product} />

          {/* Section: Vous aimerez aussi */}
          {similarProducts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-border">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Vous aimerez aussi</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
                {similarProducts.map((p) => (
                  <Link key={p.id} href={`/product/${p.id}`} className="group">
                    <div className="relative aspect-square bg-accent rounded-xl overflow-hidden mb-4">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{p.name}</h3>
                    <p className="text-secondary text-xs mb-2">{p.category}</p>
                    <p className="font-bold text-sm">{p.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

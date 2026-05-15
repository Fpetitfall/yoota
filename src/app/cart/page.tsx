"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Heart, Plus, Minus, ChevronLeft, ShieldCheck, Truck, RotateCcw, ShoppingBag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  const subtotal = totalPrice;
  const shipping = 0;
  const taxes = subtotal * 0.20;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="pt-24 pb-20 px-4 md:px-8 lg:px-16 max-w-[1400px] mx-auto">
        <div className="mb-10 mt-4">
          <Link href="/" className="flex items-center text-[11px] font-bold hover:underline mb-6 group uppercase tracking-widest text-secondary hover:text-black transition-colors">
            <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
            Continuer mes achats
          </Link>
          <div className="text-center lg:text-left">
            <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter">Mon Panier</h1>
            <p className="text-secondary text-sm mt-1 font-medium">{cart.length} article{cart.length > 1 ? "s" : ""} au total</p>
          </div>
        </div>

        {/* Empty Cart State */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-8 text-center">
            <ShoppingBag className="w-20 h-20 text-border" />
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Votre panier est vide</h2>
              <p className="text-secondary font-medium text-sm">Ajoutez des articles depuis la boutique pour commencer.</p>
            </div>
            <Link href="/" className="bg-black text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-black/80 transition-all">
              Voir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-16">
            {/* Cart Items */}
            <div className="xl:col-span-8 space-y-10">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 lg:gap-8 pb-10 border-b border-gray-100 last:border-0">
                  <div className="relative w-full sm:w-40 aspect-square bg-accent overflow-hidden rounded-2xl mx-auto sm:mx-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-3">
                        <div>
                          <h3 className="text-xl lg:text-lg font-bold tracking-tight">{item.name}</h3>
                          <p className="text-secondary text-sm font-medium">{item.category}</p>
                        </div>
                        <p className="text-xl lg:text-lg font-black">{item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                      </div>
                      <div className="mt-3 space-y-0.5 text-secondary text-[13px] font-medium">
                        <p>Sous-total : {(item.price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-5">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-black/10 rounded-full px-5 py-2 space-x-6">
                        <button
                          className="hover:opacity-50 transition-opacity"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-base w-4 text-center">{item.quantity}</span>
                        <button
                          className="hover:opacity-50 transition-opacity"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-6 text-secondary">
                        <button className="hover:text-black transition-colors flex items-center gap-2 group">
                          <Heart className="w-4 h-4 group-hover:fill-black transition-all" />
                          <span className="text-[11px] font-bold uppercase tracking-wider">Favoris</span>
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="hover:text-red-500 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-[11px] font-bold uppercase tracking-wider">Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Banner */}
              <div className="bg-brand-volt p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-black/5 shadow-xl shadow-brand-volt/20">
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left text-black">
                  <div className="w-12 h-8 bg-black flex items-center justify-center rounded-md shadow-lg">
                    <svg className="w-6 h-3 text-white" viewBox="0 0 1000 1000" fill="currentColor">
                      <path d="M245.8075 717.62406c-29.79588-1.1837-54.1734-9.3368-73.23459-24.4796-3.63775-2.8928-12.30611-11.5663-15.21427-15.2245-7.72958-9.7193-12.98467-19.1785-16.48977-29.6734-10.7857-32.3061-5.23469-74.6989 15.87753-121.2243 18.0765-39.8316 45.96932-79.3366 94.63252-134.0508 7.16836-8.0511 28.51526-31.5969 28.65302-31.5969.051 0-1.11225 2.0153-2.57652 4.4694-12.65304 21.1938-23.47957 46.158-29.37751 67.7703-9.47448 34.6785-8.33163 64.4387 3.34693 87.5151 8.05611 15.898 21.86731 29.6684 37.3979 37.2806 27.18874 13.3214 66.9948 14.4235 115.60699 3.2245 3.34694-.7755 169.19363-44.801 368.55048-97.8366 199.35686-53.0408 362.49439-96.4029 362.51989-96.3672.056.046-463.16259 198.2599-703.62654 301.0914-38.08158 16.2806-48.26521 20.3928-66.16827 26.6785-45.76525 16.0714-86.76008 23.7398-119.89779 22.4235z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm uppercase tracking-tight">Un membre, des avantages</p>
                    <p className="text-black/70 text-xs font-medium">Inscrivez-vous pour la livraison gratuite.</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold underline uppercase tracking-widest text-black hover:text-black/60 transition-colors">Se connecter</button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="xl:col-span-4">
              <div className="bg-white border border-black/5 p-6 rounded-[1.5rem] shadow-sm">
                <h2 className="text-xl font-black uppercase mb-6 tracking-tighter">Récapitulatif</h2>
                <div className="space-y-4 text-sm font-bold">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary font-medium">Sous-total ({cart.length})</span>
                    <span>{subtotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary font-medium">Livraison</span>
                    <span className="text-green-600 uppercase text-[10px] font-black">Gratuit</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary font-medium underline decoration-dotted underline-offset-4 cursor-help">Taxes (estim.)</span>
                    <span>{taxes.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center text-xl font-black tracking-tighter">
                    <span>Total</span>
                    <span>{total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                </div>
                <Link 
                  href="/checkout"
                  className="block w-full bg-black text-white py-4 rounded-full font-black text-sm mt-8 hover:bg-red-600 transition-all uppercase tracking-widest active:scale-[0.98] text-center"
                >
                  Passer la commande
                </Link>
                <div className="mt-6 flex flex-wrap justify-center gap-3 opacity-30">
                  <div className="text-[9px] font-black border border-black px-2 py-0.5 rounded">VISA</div>
                  <div className="text-[9px] font-black border border-black px-2 py-0.5 rounded">MC</div>
                  <div className="text-[9px] font-black border border-black px-2 py-0.5 rounded">PP</div>
                  <div className="text-[9px] font-black border border-black px-2 py-0.5 rounded">APPLE</div>
                </div>
                <div className="mt-8 space-y-6 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <Truck className="w-5 h-5 text-secondary" />
                    <p className="font-bold text-[10px] uppercase tracking-widest">Livraison Express</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <RotateCcw className="w-5 h-5 text-secondary" />
                    <p className="font-bold text-[10px] uppercase tracking-widest">Retours gratuits</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-secondary" />
                    <p className="font-bold text-[10px] uppercase tracking-widest">Paiement Sécurisé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <section className="mt-32">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter">Vous pourriez aussi aimer</h2>
            <div className="w-12 h-1 bg-black mt-3 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;

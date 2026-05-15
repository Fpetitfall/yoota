"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PaymentMethods, { PaymentMethod } from "@/components/checkout/PaymentMethods";
import OrderSummary from "@/components/checkout/OrderSummary";
import { ChevronLeft, ShieldCheck, Truck, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/context/CartContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [isLoading, setIsLoading] = useState(false);
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (paymentMethod === "stripe") {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            successUrl: `${window.location.origin}/checkout/success`,
            cancelUrl: `${window.location.origin}/checkout`,
          }),
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || "Erreur lors de la création de la session");
        }
      } else {
        // Simulation Wave / OM
        setTimeout(() => {
          alert(`Redirection vers la plateforme ${paymentMethod.toUpperCase()}...`);
          setIsLoading(false);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      alert("Erreur: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb" }}>
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link 
            href="/cart" 
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-secondary hover:text-black transition-colors mb-12"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour au panier</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Colonne de gauche : Formulaire */}
            <div className="lg:col-span-7 space-y-12">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black uppercase tracking-tighter">Livraison</h2>
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <Truck className="w-3 h-3" />
                    <span>Livraison Gratuite</span>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary px-1">Prénom</label>
                      <input type="text" className="w-full bg-accent border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary px-1">Nom</label>
                      <input type="text" className="w-full bg-accent border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary px-1">Adresse Email</label>
                    <input type="email" className="w-full bg-accent border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary px-1">Adresse de livraison</label>
                    <input type="text" className="w-full bg-accent border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all" placeholder="Rue de l'Indépendance, Dakar" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary px-1">Ville</label>
                      <input type="text" className="w-full bg-accent border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all" placeholder="Dakar" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-secondary px-1">Téléphone</label>
                      <input type="tel" className="w-full bg-accent border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all" placeholder="+221 77 000 00 00" />
                    </div>
                  </div>
                </form>
              </section>

              <section className="pt-12 border-t border-gray-100">
                <PaymentMethods 
                  selected={paymentMethod} 
                  onChange={setPaymentMethod} 
                />
              </section>

              <div className="pt-12">
                {paymentMethod === "paypal" ? (
                  <div className="relative z-0">
                    <PayPalButtons 
                      style={{ layout: "vertical", shape: "pill", label: "pay" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "EUR",
                                value: totalPrice.toFixed(2),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        if (actions.order) {
                          const details = await actions.order.capture();
                          alert("Transaction réussie par " + (details.payer?.name?.given_name || "Client"));
                          router.push("/checkout/success");
                        }
                      }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || cart.length === 0}
                    className={`w-full bg-black text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[4px] transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center space-x-3 ${
                      (isLoading || cart.length === 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Traitement...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Payer Maintenant</span>
                      </>
                    )}
                  </button>
                )}
                
                <div className="flex items-center justify-center space-x-6 mt-8 text-secondary">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Paiement Sécurisé SSL</span>
                  </div>
                  <div className="w-px h-3 bg-gray-200" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Satisfait ou Remboursé</span>
                </div>
              </div>
            </div>

            {/* Colonne de droite : Récapitulatif */}
            <div className="lg:col-span-5">
              <OrderSummary />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </PayPalScriptProvider>
  );
};

export default CheckoutPage;

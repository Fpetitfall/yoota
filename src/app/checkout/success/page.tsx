"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // On vide le panier une fois le paiement réussi
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-40 pb-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Commande Confirmée !
            </h1>
            <p className="text-secondary text-lg mb-12 max-w-lg mx-auto leading-relaxed">
              Merci pour votre achat. Votre commande a été validée avec succès. Vous recevrez un e-mail de confirmation d'ici quelques instants.
            </p>

            <div className="bg-accent rounded-[2.5rem] p-8 md:p-12 mb-12 border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">N° Commande</p>
                  <p className="font-bold">#YT-{Math.floor(Math.random() * 100000)}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Date</p>
                  <p className="font-bold">{new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Méthode</p>
                  <p className="font-bold">Stripe Payment</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/collections" 
                className="w-full sm:w-auto bg-black text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center gap-3"
              >
                <span>Continuer mes achats</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/" 
                className="w-full sm:w-auto border border-gray-200 px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Retour à l'accueil</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessPage;

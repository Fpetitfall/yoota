"use client";

import React from "react";
import { CreditCard, Smartphone, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export type PaymentMethod = "stripe" | "wave" | "om" | "paypal";

interface PaymentMethodsProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const PaymentMethods = ({ selected, onChange }: PaymentMethodsProps) => {
  const methods = [
    {
      id: "stripe",
      name: "Carte Bancaire",
      description: "Visa, Mastercard, AMEX",
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-blue-600",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Paiement sécurisé via votre compte",
      icon: (
        <div className="w-6 h-6 bg-[#003087] rounded-sm flex items-center justify-center text-white text-[8px] font-black italic">
          PP
        </div>
      ),
      color: "bg-[#003087]",
    },
    {
      id: "wave",
      name: "Wave",
      description: "Paiement mobile instantané",
      icon: (
        <div className="w-6 h-6 bg-[#1da1f2] rounded-full flex items-center justify-center text-white text-[10px] font-black italic">
          W
        </div>
      ),
      color: "bg-[#1da1f2]",
    },
    {
      id: "om",
      name: "Orange Money",
      description: "Paiement via USSD ou Application",
      icon: (
        <div className="w-6 h-6 bg-[#ff7900] rounded-sm flex items-center justify-center text-white text-[8px] font-black uppercase">
          OM
        </div>
      ),
      color: "bg-[#ff7900]",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black uppercase tracking-tighter mb-6">Mode de paiement</h3>
      <div className="grid grid-cols-1 gap-3">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onChange(method.id as PaymentMethod)}
            className={`relative flex items-center justify-between p-5 border-2 rounded-2xl transition-all duration-300 text-left ${
              selected === method.id
                ? "border-black bg-gray-50 shadow-sm"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl text-white ${method.color}`}>
                {method.icon}
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider">{method.name}</p>
                <p className="text-xs text-secondary">{method.description}</p>
              </div>
            </div>
            
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected === method.id ? "bg-black border-black" : "border-gray-200"
            }`}>
              {selected === method.id && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
          </button>
        ))}
      </div>

      {/* Détails spécifiques selon le mode */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={selected}
        className="mt-6 p-6 bg-accent rounded-2xl border border-border/50"
      >
        {selected === "stripe" && (
          <div className="space-y-4">
            <p className="text-xs text-secondary leading-relaxed">
              Vous allez être redirigé vers notre plateforme de paiement sécurisée Stripe pour finaliser votre achat par carte bancaire.
            </p>
          </div>
        )}
        {selected === "paypal" && (
          <div className="space-y-4">
            <p className="text-xs text-secondary leading-relaxed">
              Payer avec PayPal ; vous pouvez payer avec votre carte de crédit si vous n'avez pas de compte PayPal.
            </p>
          </div>
        )}
        {selected === "wave" && (
          <div className="space-y-4">
            <p className="text-xs text-secondary leading-relaxed mb-4">
              Entrez votre numéro de téléphone pour recevoir la demande de paiement Wave.
            </p>
            <div className="flex gap-2">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-xl flex items-center gap-2 flex-1">
                <span className="text-sm font-bold text-gray-400">+221</span>
                <input 
                  type="tel" 
                  placeholder="77 000 00 00" 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium"
                />
              </div>
            </div>
          </div>
        )}
        {selected === "om" && (
          <div className="space-y-4">
            <p className="text-xs text-secondary leading-relaxed mb-4">
              Un code de confirmation vous sera envoyé par SMS pour valider votre transaction Orange Money.
            </p>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="text-sm font-bold text-gray-400">+221</span>
              <input 
                type="tel" 
                placeholder="77 000 00 00" 
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentMethods;

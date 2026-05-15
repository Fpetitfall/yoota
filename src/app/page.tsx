"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SHOES = [
  {
    id: 1,
    name: "Air Max 270",
    price: "110",
    img: "/images/AH5223_001.png.png",
    color: "#ff0000"
  },
  {
    id: 2,
    name: "React Vision",
    price: "135",
    img: "/images/fashion-shoes-sneakers.png",
    color: "#ffffff"
  }
];

export default function Home() {
  const [active, setActive] = useState(0);

  return (
    <main className="relative min-h-screen bg-[#060606] text-white selection:bg-red-600 font-inter overflow-x-hidden">
      
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[100dvh] w-full flex flex-col overflow-hidden">
        
        {/* --- MOBILE VIEW (Inspiration Moderne) --- */}
        <div className="lg:hidden relative flex-1 flex flex-col pt-24 pb-8 px-6 overflow-hidden">
          
          {/* Background Text "JUMP" (Top Right) */}
          <div className="absolute top-[15%] right-[-15%] pointer-events-none opacity-20 rotate-90 origin-right whitespace-nowrap">
            <span className="text-[35vw] font-black italic text-red-600 leading-none">JUMP</span>
          </div>

          {/* Background Text "MAN" (Bottom Left) */}
          <div className="absolute bottom-[20%] left-[-15%] pointer-events-none opacity-5 whitespace-nowrap">
            <span className="text-[35vw] font-black italic outline-text leading-none">MAN</span>
          </div>

          {/* Main Visual: Shoe in a Vortex of Light */}
          <div className="relative flex-1 flex items-center justify-center">
            {/* Glow Aura */}
            <div className="absolute w-64 h-64 bg-red-600/20 blur-[80px] rounded-full animate-pulse" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.5, rotate: -30, y: 50 }}
                animate={{ opacity: 1, scale: 1.1, rotate: -20, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 0, y: -50 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="relative w-full aspect-square flex items-center justify-center z-20"
              >
                <Image 
                  src={SHOES[active].img} 
                  alt="Jordan" 
                  fill 
                  className="object-contain drop-shadow-[0_40px_60px_rgba(220,38,38,0.3)]"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Price Tag (Floating Modern Style) */}
            <div className="absolute bottom-[10%] right-0 z-30 flex flex-col items-end">
               <motion.div 
                key={active}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-[2rem] shadow-2xl"
               >
                 <div className="flex items-baseline gap-1">
                   <span className="text-red-600 text-5xl font-black italic">{SHOES[active].price}</span>
                   <span className="text-white text-2xl font-black">$</span>
                 </div>
                 <p className="text-[8px] font-black uppercase tracking-[3px] text-white/40 mt-1">Exclusive</p>
               </motion.div>
            </div>
          </div>

          {/* Bottom Interaction Area */}
          <div className="relative z-40 mt-auto space-y-8">
            {/* Model Switcher */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-4 p-2 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
                {SHOES.map((shoe, i) => (
                  <button
                    key={shoe.id}
                    onClick={() => setActive(i)}
                    className={`relative w-20 h-16 rounded-2xl transition-all duration-500 overflow-hidden ${active === i ? 'bg-red-600 scale-105 shadow-lg shadow-red-600/30' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    <Image src={shoe.img} alt="Switch" fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons (Stacked & Premium) */}
            <div className="flex flex-col gap-3">
              <Link href="/promotions" className="w-full bg-white text-black font-black py-6 rounded-2xl uppercase tracking-[4px] text-xs hover:bg-red-600 hover:text-white transition-all shadow-xl text-center">
                Acheter maintenant
              </Link>
              <Link href="/collections" className="w-full bg-transparent border border-white/10 text-white font-black py-5 rounded-2xl uppercase tracking-[4px] text-[10px] backdrop-blur-sm text-center">
                Plus de détails
              </Link>
            </div>
          </div>
        </div>


        {/* --- DESKTOP VIEW (Gardé Intact comme demandé) --- */}
        <div className="hidden lg:flex flex-1 flex-col pt-20">
          {/* Background Text Layer */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
            <motion.div 
              key={active}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-row items-center font-black italic uppercase leading-none"
            >
              <span className="text-[20vw] text-red-600 mr-8 leading-none">JUMP</span>
              <span className="text-[20vw] text-white/5 outline-text leading-none">MAN</span>
            </motion.div>
          </div>

          {/* Product Layer */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-24">
            <div className="relative w-full max-w-[900px] aspect-video flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ x: 300, opacity: 0, rotate: -15, scale: 0.7 }}
                  animate={{ x: 0, opacity: 1, rotate: -20, scale: 1.15 }}
                  exit={{ x: -300, opacity: 0, rotate: 0, scale: 0.7 }}
                  transition={{ duration: 0.7, type: "spring", damping: 20 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <Image src={SHOES[active].img} alt="Jordan" fill className="object-contain drop-shadow-[0_80px_120px_rgba(0,0,0,1)]" priority />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Price Label */}
            <div className="absolute right-24 bottom-1/4 flex flex-col items-end z-50">
               <div className="flex items-baseline space-x-2">
                 <span className="text-red-600 text-9xl font-black italic leading-none">{SHOES[active].price}</span>
                 <span className="text-white text-4xl font-black leading-none">$</span>
               </div>
               <div className="bg-red-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest mt-6 shadow-2xl">
                  Limited Edition
               </div>
            </div>
          </div>

          {/* Interaction Bar */}
          <div className="relative z-30 w-full px-24 pb-12 flex flex-row items-end justify-between gap-12 mt-auto">
            <div className="flex flex-col space-y-4">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[4px]">Switch Style</p>
              <div className="flex space-x-4">
                {SHOES.map((shoe, i) => (
                  <button key={shoe.id} onClick={() => setActive(i)} className={`group relative w-24 h-20 rounded-2xl bg-white/5 border-2 transition-all p-2 flex items-center justify-center overflow-hidden ${active === i ? 'border-red-600 bg-white/10' : 'border-transparent hover:bg-white/10'}`}>
                    <div className="relative w-full h-full group-hover:scale-110 transition-transform"><Image src={shoe.img} alt="preview" fill className="object-contain" sizes="100px" /></div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/promotions" className="bg-white text-black font-black text-xs uppercase tracking-[3px] px-16 py-6 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-2xl">Voir plus</Link>
              <Link href="/collections" className="border-2 border-white/10 text-white font-black text-xs uppercase tracking-[3px] px-12 py-6 rounded-2xl hover:border-white transition-all">Details</Link>
            </div>

            <div className="max-w-[200px] text-right">
               <p className="text-[10px] font-black text-white uppercase tracking-[4px] mb-2">Heritage</p>
               <p className="text-[9px] text-white/30 leading-relaxed uppercase font-medium">The Jordan Brand represents more than just shoes. It's a legacy of flight.</p>
            </div>
          </div>
        </div>

      </section>

      <Footer />

      <style jsx global>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.15);
          color: transparent;
        }
      `}</style>
    </main>
  );
}

"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Heart, ShoppingBag, User, Menu, X, Sparkles, Star, Baby, Layers, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/data/products";
import { Product } from "@/types";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { totalItems: cartTotal, openDrawer: openCartDrawer } = useCart();
  const { totalItems: wishlistTotal, openDrawer: openWishlistDrawer } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Déconnecté par défaut
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;

  // Normalisation string pour la recherche
  const normalize = (str?: string) =>
    (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const queryTerms = normalize(searchQuery).split(/\s+/).filter(Boolean);
      const filtered = products.filter(product => {
        const searchableText = normalize(`${product.name} ${product.category} ${product.gender} ${product.tag || ""}`);
        return queryTerms.every(term => searchableText.includes(term));
      });
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Fermer les suggestions si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      startTransition(() => {
        router.push(`/collections?q=${encodeURIComponent(query)}`);
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
        setShowSuggestions(false);
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Nouveautés", href: "/nouveautes" },
    { 
      name: "Catégories", 
      dropdown: [
        { name: "Homme", href: "/homme" },
        { name: "Femme", href: "/femme" },
        { name: "Enfant", href: "/enfant" },
      ]
    },
    { name: "Collections", href: "/collections" },
    { name: "Promotions", href: "/promotions" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isTransparent ? "bg-transparent text-white h-24" : isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm h-16 text-black" : "bg-white h-20 text-black"
        }`}
      >
        {/* Barre de recherche mobile (Overlay) */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.25 }}
              className="absolute top-0 left-0 w-full h-full bg-white z-[60] px-4 flex items-center shadow-sm"
            >
              <button 
                onClick={() => {
                   setIsMobileSearchOpen(false);
                   setShowSuggestions(false);
                }}
                className="p-2 mr-2 hover:bg-accent rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-black" />
              </button>
              <div className="relative w-full flex-1">
                <form onSubmit={handleSearch} className="w-full flex items-center bg-accent rounded-full px-4 py-2 border border-gray-100">
                  <button type="submit">
                    <Search className="w-4 h-4 text-secondary" />
                  </button>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    autoFocus
                    className="w-full bg-transparent border-none focus:ring-0 text-sm ml-2 outline-none text-black"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0) setShowSuggestions(true);
                    }}
                  />
                </form>
                {/* Suggestions Dropdown Mobile Header */}
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-3 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100]"
                    >
                      {suggestions.length > 0 ? (
                        suggestions.map(product => (
                          <div 
                            key={product.id} 
                            onClick={() => {
                              const query = product.name;
                              setSearchQuery(query);
                              setShowSuggestions(false);
                              setIsMobileSearchOpen(false);
                              startTransition(() => {
                                router.push(`/collections?q=${encodeURIComponent(query)}`);
                              });
                            }} 
                            className="flex items-center space-x-3 p-3 hover:bg-accent cursor-pointer transition-colors"
                          >
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-sm font-bold truncate text-black">{product.name}</span>
                              <span className="text-xs text-secondary truncate">{product.category}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-secondary">
                          Aucun résultat pour "{searchQuery}"
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <svg
              className={`w-14 h-7 sm:w-16 sm:h-8 md:w-20 md:h-10 transition-colors ${isTransparent ? 'text-white' : 'text-black'}`}
              viewBox="0 0 1000 1000"
              fill="currentColor"
              preserveAspectRatio="xMidYMid meet"
            >
              <path d="M245.8075 717.62406c-29.79588-1.1837-54.1734-9.3368-73.23459-24.4796-3.63775-2.8928-12.30611-11.5663-15.21427-15.2245-7.72958-9.7193-12.98467-19.1785-16.48977-29.6734-10.7857-32.3061-5.23469-74.6989 15.87753-121.2243 18.0765-39.8316 45.96932-79.3366 94.63252-134.0508 7.16836-8.0511 28.51526-31.5969 28.65302-31.5969.051 0-1.11225 2.0153-2.57652 4.4694-12.65304 21.1938-23.47957 46.158-29.37751 67.7703-9.47448 34.6785-8.33163 64.4387 3.34693 87.5151 8.05611 15.898 21.86731 29.6684 37.3979 37.2806 27.18874 13.3214 66.9948 14.4235 115.60699 3.2245 3.34694-.7755 169.19363-44.801 368.55048-97.8366 199.35686-53.0408 362.49439-96.4029 362.51989-96.3672.056.046-463.16259 198.2599-703.62654 301.0914-38.08158 16.2806-48.26521 20.3928-66.16827 26.6785-45.76525 16.0714-86.76008 23.7398-119.89779 22.4235z" />
            </svg>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-12 h-full">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative h-full flex items-center group"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
              >
                <Link
                  href={link.href || "#"}
                  className={`text-[11px] font-black uppercase tracking-[2px] transition-all duration-300 flex items-center gap-1 ${
                    pathname === link.href ? "text-red-600" : ""
                  } hover:text-red-600`}
                >
                  {link.name}
                </Link>

                {/* Dropdown Verre Ultra-Moderne */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className={`absolute top-[90%] left-1/2 -translate-x-1/2 w-60 backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.4)] border border-white/10 rounded-[2.5rem] p-4 z-50 overflow-hidden ${
                        isTransparent ? "bg-black/40 text-white" : "bg-white/80 text-black border-black/5 shadow-xl"
                      }`}
                    >
                      <div className="flex flex-col space-y-1">
                        {link.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`flex items-center px-6 py-4 text-[12px] font-black uppercase tracking-[2px] rounded-3xl transition-all duration-300 ${
                              isTransparent 
                                ? "hover:bg-white/10 hover:text-red-500" 
                                : "hover:bg-black/5 hover:text-red-600"
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
            <div ref={searchRef} className="relative hidden md:block">
              <form onSubmit={handleSearch} className={`flex items-center rounded-full px-4 py-2 w-48 lg:w-64 transition-all ${isTransparent ? 'bg-white/10 focus-within:ring-white/30' : 'bg-accent focus-within:ring-2 focus-within:ring-primary/20'}`}>
                <button type="submit">
                  <Search className={`w-4 h-4 ${isTransparent ? 'text-white' : 'text-black'}`} />
                </button>
                <input
                  type="text"
                  placeholder="Rechercher"
                  className={`bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none placeholder:text-current opacity-70 focus:opacity-100 ${isTransparent ? 'text-white placeholder:text-white/60' : 'text-black placeholder:text-gray-500'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) setShowSuggestions(true);
                  }}
                />
              </form>
              
              {/* Suggestions Dropdown Desktop */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden z-[999]"
                  >
                    {suggestions.length > 0 ? (
                      suggestions.map(product => (
                          <div 
                            key={product.id} 
                            onClick={() => {
                              const query = product.name;
                              setSearchQuery(query);
                              setShowSuggestions(false);
                              startTransition(() => {
                                router.push(`/collections?q=${encodeURIComponent(query)}`);
                              });
                            }} 
                            className="flex items-center space-x-3 p-3 hover:bg-accent cursor-pointer transition-colors"
                          >
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold truncate text-black">{product.name}</span>
                            <span className="text-xs text-secondary truncate">{product.category}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-secondary">
                        Aucun résultat pour "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              className="p-2 hover:bg-accent rounded-full transition-colors md:hidden"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button 
              className="p-2 hover:bg-accent rounded-full transition-colors relative"
              onClick={openWishlistDrawer}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistTotal > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                  {wishlistTotal}
                </span>
              )}
            </button>
            <button onClick={openCartDrawer} className="p-2 hover:bg-accent rounded-full transition-colors relative">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartTotal > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                  {cartTotal}
                </span>
              )}
            </button>
            <div 
              ref={profileRef}
              className="relative hidden md:block"
            >
              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    setIsProfileOpen(!isProfileOpen);
                  } else {
                    router.push("/auth/login");
                  }
                }}
                className="p-2 hover:bg-accent rounded-full transition-colors block"
              >
                <User className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-black'}`} />
              </button>

              <AnimatePresence>
                {isLoggedIn && isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-[1.5rem] shadow-2xl p-2 z-50 text-black"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                      <p className="text-[10px] font-black uppercase text-gray-400">Compte</p>
                      <p className="text-xs font-black truncate">Mon Profil Client</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsProfileOpen(false);
                        router.push("/");
                      }}
                      className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                    >
                      Déconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              className="p-2 hover:bg-accent rounded-full transition-colors lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260, mass: 0.9 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[110] flex flex-col p-8 overflow-y-auto text-black"
            >
              <div className="flex justify-between items-center mb-8">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 1000 1000"
                  fill="currentColor"
                >
                  <path d="M245.8075 717.62406c-29.79588-1.1837-54.1734-9.3368-73.23459-24.4796-3.63775-2.8928-12.30611-11.5663-15.21427-15.2245-7.72958-9.7193-12.98467-19.1785-16.48977-29.6734-10.7857-32.3061-5.23469-74.6989 15.87753-121.2243 18.0765-39.8316 45.96932-79.3366 94.63252-134.0508 7.16836-8.0511 28.51526-31.5969 28.65302-31.5969.051 0-1.11225 2.0153-2.57652 4.4694-12.65304 21.1938-23.47957 46.158-29.37751 67.7703-9.47448 34.6785-8.33163 64.4387 3.34693 87.5151 8.05611 15.898 21.86731 29.6684 37.3979 37.2806 27.18874 13.3214 66.9948 14.4235 115.60699 3.2245 3.34694-.7755 169.19363-44.801 368.55048-97.8366 199.35686-53.0408 362.49439-96.4029 362.51989-96.3672.056.046-463.16259 198.2599-703.62654 301.0914-38.08158 16.2806-48.26521 20.3928-66.16827 26.6785-45.76525 16.0714-86.76008 23.7398-119.89779 22.4235z" />
                </svg>
                <button
                  className="p-2 hover:bg-accent rounded-full transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="relative w-full">
                <form onSubmit={handleSearch} className="flex items-center bg-accent rounded-full px-4 py-3 mb-8 w-full focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <button type="submit">
                    <Search className="w-5 h-5 text-secondary" />
                  </button>
                  <input
                    type="text"
                    placeholder="Rechercher"
                    className="bg-transparent border-none focus:ring-0 text-base ml-3 w-full outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0) setShowSuggestions(true);
                    }}
                  />
                </form>

                {/* Suggestions Dropdown Mobile */}
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-[60px] left-0 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[100] mb-8"
                    >
                      {suggestions.length > 0 ? (
                        suggestions.map(product => (
                          <div 
                            key={product.id} 
                            onClick={() => {
                              const query = product.name;
                              setSearchQuery(query);
                              setShowSuggestions(false);
                              setIsMobileMenuOpen(false);
                              startTransition(() => {
                                router.push(`/collections?q=${encodeURIComponent(query)}`);
                              });
                            }} 
                            className="flex items-center space-x-3 p-3 hover:bg-accent cursor-pointer transition-colors"
                          >
                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-base font-bold truncate text-black">{product.name}</span>
                              <span className="text-sm text-secondary truncate">{product.category}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-secondary">
                          Aucun résultat pour "{searchQuery}"
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            <div className="flex flex-col h-full items-center">
              <nav className="flex flex-col space-y-6 mt-12 w-full">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-gray-100 pb-6 w-full flex flex-col items-center">
                    {link.dropdown ? (
                      <div className="space-y-4 w-full">
                        <button 
                          onClick={() => setOpenMobileSubmenu(openMobileSubmenu === link.name ? null : link.name)}
                          className="w-full flex justify-center items-center gap-4 text-2xl font-black uppercase tracking-widest hover:text-red-600 transition-colors"
                        >
                          <span>{link.name}</span>
                          <motion.span
                            animate={{ rotate: openMobileSubmenu === link.name ? 180 : 0 }}
                            className="text-red-600"
                          >
                            ↓
                          </motion.span>
                        </button>
                        
                        <AnimatePresence>
                          {openMobileSubmenu === link.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden flex flex-col space-y-4 items-center"
                            >
                              {link.dropdown.map(sub => (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="text-xl font-bold uppercase tracking-widest text-gray-500 hover:text-red-600 transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href || "#"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-black uppercase tracking-widest hover:text-red-600 transition-colors block text-center"
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-auto border-t pt-8 pb-12">
                <div className="flex flex-col space-y-6">
                  <div className="flex flex-col space-y-4">
                    {isLoggedIn ? (
                      <button 
                        onClick={() => {
                          setIsLoggedIn(false);
                          setIsMobileMenuOpen(false);
                          router.push("/");
                        }}
                        className="flex items-center space-x-4 text-red-600 transition-colors"
                      >
                        <User className="w-6 h-6" />
                        <span className="text-xl font-bold uppercase tracking-widest text-sm">Déconnexion</span>
                      </button>
                    ) : (
                      <Link 
                        href="/auth/login" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-4 hover:text-red-600 transition-colors"
                      >
                        <User className="w-6 h-6" />
                        <span className="text-xl font-bold uppercase tracking-widest text-sm">Connexion / S'inscrire</span>
                      </Link>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest leading-loose">
                    Créez votre compte pour suivre vos commandes et profiter de nos offres exclusives.
                  </p>
                </div>
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

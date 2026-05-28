"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // 1. Écouter l'état d'authentification de l'utilisateur
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.error("Erreur vérification utilisateur panier :", err);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // 2. Charger et synchroniser le panier (localStorage vs Supabase)
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        try {
          // Charger le panier depuis Supabase
          const { data: dbItems, error } = await supabase
            .from("cart_items")
            .select("*, products(*)");

          if (error) throw error;

          // Récupérer le panier local (guest)
          const savedCart = localStorage.getItem("yoota-cart");
          const localCart = savedCart ? JSON.parse(savedCart) : [];

          if (localCart.length > 0) {
            // Fusionner le panier local dans Supabase
            for (const item of localCart) {
              const selectedColor = item.colors?.[0] || null;
              const selectedSize = item.sizes?.[0] || null;

              // Tenter de l'insérer ou d'incrémenter s'il existe déjà
              const { data: existing } = await supabase
                .from("cart_items")
                .select("id, quantity")
                .eq("user_id", user.id)
                .eq("product_id", item.id)
                .eq("color", selectedColor)
                .eq("size", selectedSize)
                .maybeSingle();

              if (existing) {
                await supabase
                  .from("cart_items")
                  .update({ quantity: existing.quantity + item.quantity })
                  .eq("id", existing.id);
              } else {
                await supabase.from("cart_items").insert({
                  user_id: user.id,
                  product_id: item.id,
                  quantity: item.quantity,
                  color: selectedColor,
                  size: selectedSize,
                });
              }
            }

            // Vider le localStorage local après fusion
            localStorage.removeItem("yoota-cart");

            // Recharger le panier consolidé depuis la DB
            const { data: mergedItems } = await supabase
              .from("cart_items")
              .select("*, products(*)");

            if (mergedItems) {
              const formattedCart = mergedItems.map((item: any) => ({
                ...item.products,
                quantity: item.quantity,
                colors: item.color ? [item.color] : item.products.colors,
                sizes: item.size ? [item.size] : item.products.sizes,
              }));
              setCart(formattedCart);
            }
          } else if (dbItems) {
            // Pas de panier local, on charge directement le panier Supabase
            const formattedCart = dbItems.map((item: any) => ({
              ...item.products,
              quantity: item.quantity,
              colors: item.color ? [item.color] : item.products.colors,
              sizes: item.size ? [item.size] : item.products.sizes,
            }));
            setCart(formattedCart);
          }
        } catch (err) {
          console.error("Erreur lors de la synchronisation du panier Supabase :", err);
        }
      } else {
        // Utilisateur non connecté : charger depuis localStorage
        const savedCart = localStorage.getItem("yoota-cart");
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        } else {
          setCart([]);
        }
      }
    };

    syncCart();
  }, [user, supabase]);

  // 3. Sauvegarder dans localStorage (uniquement si Guest)
  useEffect(() => {
    if (!user) {
      localStorage.setItem("yoota-cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  // Bloquer le scroll lors de l'ouverture du drawer
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  const addToCart = async (product: Product) => {
    const selectedColor = product.colors?.[0] || null;
    const selectedSize = product.sizes?.[0] || null;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    if (user) {
      try {
        const { data: existing } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("user_id", user.id)
          .eq("product_id", product.id)
          .eq("color", selectedColor)
          .eq("size", selectedSize)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("cart_items")
            .update({ quantity: existing.quantity + 1 })
            .eq("id", existing.id);
        } else {
          await supabase.from("cart_items").insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
            color: selectedColor,
            size: selectedSize,
          });
        }
      } catch (err) {
        console.error("Erreur ajout panier Supabase :", err);
      }
    }
    setIsDrawerOpen(true);
  };

  const removeFromCart = async (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    if (user) {
      try {
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
      } catch (err) {
        console.error("Erreur suppression panier Supabase :", err);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    if (user) {
      try {
        await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("user_id", user.id)
          .eq("product_id", productId);
      } catch (err) {
        console.error("Erreur modification quantité panier Supabase :", err);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);

    if (user) {
      try {
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id);
      } catch (err) {
        console.error("Erreur nettoyage panier Supabase :", err);
      }
    }
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

import { createClient } from "./server";
import { Product } from "@/types";

/**
 * Récupère tous les produits de la base de données Supabase.
 * Trié par date de création décroissante par défaut.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur Supabase lors de la récupération des produits :", error);
      return [];
    }

    return (data || []) as Product[];
  } catch (err) {
    console.error("Erreur inattendue dans getProducts :", err);
    return [];
  }
}

/**
 * Récupère un unique produit par son ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle(); // maybeSingle évite d'émettre une erreur si le produit n'existe pas

    if (error) {
      console.error(`Erreur Supabase lors de la récupération du produit ${id} :`, error);
      return null;
    }

    return data as Product;
  } catch (err) {
    console.error(`Erreur inattendue dans getProductById pour ${id} :`, err);
    return null;
  }
}

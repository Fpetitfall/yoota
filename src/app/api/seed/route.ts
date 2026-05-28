import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { products } from "@/data/products";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    // Insertion des produits en mode "upsert" pour éviter les doublons ou conflits d'IDs
    const { error: insertError } = await supabase
      .from("products")
      .upsert(
        products.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          gender: p.gender,
          price: p.price,
          image: p.image,
          rating: p.rating,
          reviews: p.reviews,
          colors: p.colors,
          sizes: p.sizes,
          tag: p.tag || null,
        })),
        { onConflict: "id" }
      );

    if (insertError) {
      console.error("Erreur lors de l'insertion des produits dans Supabase :", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${products.length} produits insérés ou mis à jour avec succès dans Supabase !`,
    });
  } catch (error: any) {
    console.error("Erreur inattendue de seeding :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

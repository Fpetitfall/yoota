import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-04-22.dahlia" as any,
  });

  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "ID de session Stripe manquant." }, { status: 400 });
    }

    // 1. Récupérer la session directement depuis les serveurs Stripe (preuve d'autorité)
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const supabase = await createClient();

      // 2. Mettre à jour le statut de paiement en "paid" dans la table orders
      const { data: updatedOrder, error: updateError } = await supabase
        .from("orders")
        .update({ payment_status: "paid" })
        .eq("stripe_session_id", sessionId)
        .select("user_id")
        .maybeSingle();

      if (updateError) {
        console.error("Erreur de mise à jour de la commande post-Stripe :", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // 3. Vider le panier Supabase de l'acheteur s'il est identifié
      if (updatedOrder && updatedOrder.user_id) {
        const { error: cartClearError } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", updatedOrder.user_id);

        if (cartClearError) {
          console.error("Erreur de nettoyage du panier Supabase post-paiement :", cartClearError);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Paiement vérifié avec succès et commande validée !",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Le paiement n'a pas été finalisé.",
      });
    }
  } catch (error: any) {
    console.error("Stripe Verification Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

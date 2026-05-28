import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-04-22.dahlia" as any,
  });

  try {
    const { items, successUrl, cancelUrl, customerDetails } = await req.json();

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // En centimes
      },
      quantity: item.quantity,
    }));

    // 1. Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    // 2. Enregistrer la commande en base Supabase avec statut "pending"
    if (customerDetails) {
      const supabase = await createClient();
      
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: customerDetails.userId || null,
          customer_email: customerDetails.email,
          customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
          shipping_address: customerDetails.address,
          city: customerDetails.city,
          phone: customerDetails.phone,
          total_amount: items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0),
          payment_method: "stripe",
          payment_status: "pending",
          stripe_session_id: session.id,
        })
        .select("id")
        .single();

      if (orderError) {
        console.error("Erreur lors de la création de la commande Supabase :", orderError);
      } else if (order) {
        // Enregistrer les articles de la commande dans order_items
        const orderItems = items.map((item: any) => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          product_image: item.image,
          price: item.price,
          quantity: item.quantity,
          color: item.colors?.[0] || null,
          size: item.sizes?.[0] || null,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) {
          console.error("Erreur lors de l'insertion des articles de commande Supabase :", itemsError);
        }
      }
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

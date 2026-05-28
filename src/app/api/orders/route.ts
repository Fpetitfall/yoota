import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { items, totalAmount, paymentMethod, paymentStatus = "pending", customerDetails } = await req.json();

    const supabase = await createClient();

    // 1. Enregistrer la commande principale
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: customerDetails.userId || null,
        customer_email: customerDetails.email,
        customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        shipping_address: customerDetails.address,
        city: customerDetails.city,
        phone: customerDetails.phone,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Erreur lors de l'enregistrement de la commande alternative :", orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // 2. Enregistrer les articles commandés
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
      console.error("Erreur lors de l'enregistrement des articles de commande alternative :", itemsError);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("Generic order creation unexpected error :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

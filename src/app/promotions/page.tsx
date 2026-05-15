import React from "react";
import CatalogTemplate from "@/components/templates/CatalogTemplate";

export default function PromotionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <CatalogTemplate
      searchParams={searchParams}
      title="Promotions"
      baseFilter={(product) => product.tag === "Promo" || product.price < 100}
      breadcrumbs={[
        { label: "Promotions" },
      ]}
    />
  );
}

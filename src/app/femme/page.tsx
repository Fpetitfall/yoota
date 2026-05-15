import React from "react";
import CatalogTemplate from "@/components/templates/CatalogTemplate";

export default function FemmePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <CatalogTemplate
      searchParams={searchParams}
      title="Femme"
      baseFilter={(product) => product.gender === "Femme"}
      breadcrumbs={[
        { label: "Femme" },
      ]}
    />
  );
}

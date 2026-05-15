import React from "react";
import CatalogTemplate from "@/components/templates/CatalogTemplate";

export default function EnfantPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <CatalogTemplate
      searchParams={searchParams}
      title="Enfant"
      baseFilter={(product) => product.gender === "Enfant"}
      breadcrumbs={[
        { label: "Enfant" },
      ]}
    />
  );
}

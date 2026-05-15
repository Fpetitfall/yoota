import React from "react";
import CatalogTemplate from "@/components/templates/CatalogTemplate";

export default function NouveautesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <CatalogTemplate
      searchParams={searchParams}
      title="Nouveautés"
      baseFilter={(product) => product.tag === "Nouveauté" || product.tag === "Exclusivité"}
      breadcrumbs={[
        { label: "Nouveautés" },
      ]}
    />
  );
}

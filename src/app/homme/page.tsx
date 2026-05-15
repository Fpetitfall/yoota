import React from "react";
import CatalogTemplate from "@/components/templates/CatalogTemplate";

export default function HommePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <CatalogTemplate
      searchParams={searchParams}
      title="Homme"
      baseFilter={(product) => product.gender === "Homme"}
      breadcrumbs={[
        { label: "Homme" },
      ]}
    />
  );
}

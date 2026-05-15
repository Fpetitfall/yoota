import React from "react";
import CatalogTemplate from "@/components/templates/CatalogTemplate";

export default function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <CatalogTemplate
      searchParams={searchParams}
      title="Collections"
      breadcrumbs={[
        { label: "Collections" },
      ]}
    />
  );
}

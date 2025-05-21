import React from "react";

interface PageProps {
  params: Promise<{
    storeName: string;
  }>;
}

const StoreNamePage = async ({ params }: PageProps) => {
  const { storeName } = await params;

  return <div>Store Name: {storeName}</div>;
};

export default StoreNamePage;

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "./Card";

const ProductCardSkeleton = () => {
  return (
    <Card padding="none">
      <Skeleton height={256} />
      <div className="p-5">
        <Skeleton height={24} width="75%" className="mb-4" />
        <Skeleton height={16} width="50%" className="mb-2" />
        <Skeleton count={2} height={16} className="mb-4" />
        <Skeleton height={40} width="50%" className="mb-4" />
        <Skeleton height={16} width="25%" className="mb-4" />
        <Skeleton height={48} />
      </div>
    </Card>
  );
};

export default ProductCardSkeleton;

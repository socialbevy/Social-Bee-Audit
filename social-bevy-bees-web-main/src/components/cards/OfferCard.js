import React from 'react';
import Image from 'next/legacy/image';
import { truncate } from '@/utils/truncate';

const OfferCard = ({ offer }) => {
  const calculateFinalPrice = () => {
    const originalPrice = offer.originalPrice;
    if (offer.discountType === "fixed") {
      return Math.max(0, originalPrice - offer.discountValue);
    } else {
      return originalPrice * (1 - (offer.discountValue / 100));
    }
  };

  const calculateDiscountPercentage = () => {
    const originalPrice = offer.originalPrice;
    const finalPrice = calculateFinalPrice();
    return Math.round((1 - finalPrice / originalPrice) * 100);
  };

  const finalPrice = calculateFinalPrice();

  return (
    <div className="group max-w-md rounded overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={offer?.mainImage?.url || "/images/no-image.jpeg"}
          alt={offer.offerName}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="px-5 py-4 flex flex-col flex-grow">
        <div className="mb-1 text-gray-700 text-sm">
          {offer.vendor.businessName}
        </div>
        <div className="font-semibold mb-2 h-12">
          {truncate(offer.offerName, 40)}
        </div>
        <div className="mt-auto">
          <p className="text-gray-700 text-base">
            <span className="line-through">${offer.originalPrice.toFixed(2)}</span>{' '}
            <span className="text-red-500">${finalPrice.toFixed(2)}</span>
          </p>
          <p className="text-green-600 font-bold">
            {calculateDiscountPercentage()}% OFF
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;

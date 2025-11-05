import React from 'react';
import Link from 'next/link';
import OfferCard from '@/components/cards/OfferCard';
import { useOffers } from "@/lib/features/offers/useOffers";
import ubuntu from '@/utils/ubuntu';

const Marketplace = () => {
  const { data: offers, status, error } = useOffers();

  return (
    <main className="mt-20 md:mt-0">
      <div className="mx-auto">
        <h1 className={`md:flex text-2xl font-semibold p-4 bg-white md:border-b border-gray-200 ${ubuntu.className}`}>
          Marketplace
        </h1>
        <div className="bg-white p-6 md:p-8 min-h-[calc(100vh-144px)] md:min-h-[calc(100vh-65px)]">
          <div className="mb-8">
            <div>
              {status === 'loading' ? (
                <p>Loading offers...</p>
              ) : error ? (
                <p className="text-red-500">{error.message}</p>
              ) : offers?.length === 0 ? (
                <p>No offers yet. Create your first offer above.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {offers?.map(offer => (
                    <Link
                      className="cursor-pointer group relative transition-all lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
                      href={`offers/${offer.id}`}
                      key={offer.id}
                    >
                      <OfferCard offer={offer} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Marketplace;
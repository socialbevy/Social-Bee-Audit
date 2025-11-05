"use client"

import Link from "next/link";
import { useUser } from "@/lib/auth/authConfig";
import { useOffersByUser } from "@/lib/features/offers/useOffers";
import ProtectedRoute from "@/lib/auth/ProtectedRoute";
import OfferCard from "@/components/cards/OfferCard";
import ubuntu from "@/utils/ubuntu";

const Offers = () => {
  const { data: user } = useUser({
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });
  const { data: offers, status, error } = useOffersByUser(user?.id);

  return (
    <ProtectedRoute>
      <main className="md:min-h-full mt-20 md:mt-0">
        <div className="mx-auto">
          <h1 className={`md:flex text-2xl font-semibold p-4 bg-white md:border-b border-gray-200 ${ubuntu.className}`}>
            Saved Offers
          </h1>
          <div className="bg-white p-6 md:p-8 min-h-[calc(100vh-144px)] md:min-h-[calc(100vh-65px)]">
            <div className="mb-8">
              {status === 'loading' ? (
                <p>Loading offers...</p>
              ) : error ? (
                <p className="text-red-500">{error.message}</p>
              ) : offers?.length === 0 ? (
                <p>No offers yet. Create your first offer above.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                  {offers?.map((offer) => (
                    <div key={offer.id} className="relative">
                      <Link
                        className="cursor-pointer group relative transition-all lg:hover:!opacity-100 lg:group-hover/list:opacity-50"
                        href={`offers/${offer.id}`}
                      >
                        <OfferCard offer={offer} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
};

export default Offers;
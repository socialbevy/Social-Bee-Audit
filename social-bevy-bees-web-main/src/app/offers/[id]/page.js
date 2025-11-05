'use client';

import React, { useState, useEffect } from "react";
import Image from 'next/legacy/image';
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useUser } from "@/lib/auth/authConfig";
import { useDeleteOffer, useOfferById, useSaveOrRedeemOffer, useOffersByUser } from '@/lib/features/offers/useOffers';
import { useSnackbar } from "@/components/notifications/Snackbar";
import { openModal } from "@/lib/features/modal/modalSlice";
import BackButton from "@/components/buttons/BackButton";
import ProtectedRoute from "@/lib/auth/ProtectedRoute";
import Spinner from "@/components/shared/Spinner";
import ubuntu from "@/utils/ubuntu";


const OfferDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const { data: user } = useUser({
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });
  const { data: offer, isLoading, error } = useOfferById(id);
  const { data: savedOffers, isLoading: loadingSavedOffers } = useOffersByUser(user?.id);
  const saveOrRedeemOfferMutation = useSaveOrRedeemOffer();
  const deleteOfferMutation = useDeleteOffer();
  const [currentImage, setCurrentImage] = useState("");

  const savedOffer = savedOffers?.find(savedOffer => savedOffer?.id == offer?.id);

  useEffect(() => {
    if (offer && offer.mainImage) {
      setCurrentImage(offer.mainImage.url);
    }
  }, [offer]);

  if (!offer || isLoading) return <Spinner />;

  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl);
  };

  const handleSave = async () => {
    try {
      const data = { user_id: user.id, offer_id: id };
      await saveOrRedeemOfferMutation.mutateAsync({ data });
      showSnackbar("Offer saved successfully!", "success");
    } catch (error) {
      console.error('Error saving offer:', error);
      showSnackbar("Error saving offer", "error");
    }
  };

  const handleUnsave = async () => {
    try {
      await deleteOfferMutation.mutateAsync(savedOffer.userOfferId);
      showSnackbar("Offer removed successfully!", "success");
    } catch (error) {
      console.error('Error removing saved offer:', error);
      showSnackbar("Error removing saved offer", "error");
    }
  }

  const handleRedeem = async () => {
    // Uncomment this when we have a subscription plan
    // if (user.membershipPlan === "Social Bee Free") {
    //   router.push("/settings/subscription");
    //   showSnackbar("You need to upgrade your subscription to redeem offers.", "info");
    //   return;
    // }
    try {
      const data = { user_id: user.id, offer_id: id };
      const result = await saveOrRedeemOfferMutation.mutateAsync({ data });
      dispatch(openModal({
        type: 'barcode',
        props: { barcodeUrl: result.barcode_url }
      }));
    } catch (error) {
      console.error('Error redeeming offer:', error);
      showSnackbar("Error redeeming offer", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-between bg-white p-4 md:border-b border-gray-200 mt-20 md:mt-0">
        <h1 className={`text-2xl font-semibold ${ubuntu.className}`}>
          View Offer
        </h1>
      </div>
      <div className="container p-6 md:p-8 bg-white">
        <div className="flex flex-col">
          <div className="max-w-3xl">
            <div className="relative h-64 w-full max-w-xl mb-4">
              <Image
                src={currentImage || "/images/no-image.jpeg"}
                alt={offer?.offerName}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="flex space-x-2 mb-4">
              {offer.mainImage && (
                <div className="w-16 h-16 relative cursor-pointer" onClick={() => handleImageClick(offer.mainImage.url)}>
                  <Image
                    src={offer.mainImage.url}
                    alt="Main Image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )}
              {offer.image2 && (
                <div className="w-16 h-16 relative cursor-pointer" onClick={() => handleImageClick(offer.image2.url)}>
                  <Image
                    src={offer.image2.url}
                    alt="Image 2"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )}
              {offer.image3 && (
                <div className="w-16 h-16 relative cursor-pointer" onClick={() => handleImageClick(offer.image3.url)}>
                  <Image
                    src={offer.image3.url}
                    alt="Image 3"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )}
              {offer.image4 && (
                <div className="w-16 h-16 relative cursor-pointer" onClick={() => handleImageClick(offer.image4.url)}>
                  <Image
                    src={offer.image4.url}
                    alt="Image 4"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )}
              {offer.image5 && (
                <div className="w-16 h-16 relative cursor-pointer" onClick={() => handleImageClick(offer.image5.url)}>
                  <Image
                    src={offer.image5.url}
                    alt="Image 5"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold mt-4">{offer.offerName}</h1>
            {(() => {
              const calculateFinalPrice = () => {
                const originalPrice = offer.originalPrice;
                if (offer.discountType === "fixed") {
                  return Math.max(0, originalPrice - offer.discountValue);
                } else { // percentage
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
                <>
                  <p className="text-3xl mt-2">
                    <span className="line-through">${offer.originalPrice.toFixed(2)}</span>{' '}
                    <span className="text-red-500">${finalPrice.toFixed(2)}</span>
                  </p>
                  <p className="text-green-600 font-bold mt-1 text-2xl">
                    {calculateDiscountPercentage()}% OFF
                  </p>
                </>
              );
            })()}
            <p className="mt-4">{offer.offerDescription}</p>
            <p className="mt-4"><strong>Usage Cycles:</strong> {offer.usageCycles}</p>
            <p className="mt-4"><strong>Usage Limit Per Cycle:</strong> {offer.usageLimitPerCycle}</p>
            <p className="mt-4"><strong>Terms and Conditions:</strong> {offer.termsAndConditions}</p>
            <p className="mt-4"><strong>Locations: </strong>
              {offer?.vendor_locations?.map(location => location.locationName).join(', ')}
            </p>
          </div>
          <div className="flex gap-2 max-w-xs py-4 mt-2">
            <button onClick={handleRedeem} className="w-full py-2 px-4 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Redeem</button>
            {!savedOffer ? (
              <button onClick={handleSave} className="w-full py-2 px-4 bg-white border font-bold border-gray-700 rounded-md hover:bg-gray-200 focusring-2 focus:ring-offset-2 focus:ring-red-500">Save</button>
            ) : (
              <button onClick={handleUnsave} className="w-full py-2 px-4 bg-white border font-bold border-gray-700 rounded-md hover:bg-gray-200 focusring-2 focus:ring-offset-2 focus:ring-red-500">Unsave</button>
            )}
          </div>
        </div>
        <BackButton onClick={() => router.push("/")}>
          Back to Marketplace
        </BackButton>
      </div>
    </ProtectedRoute>
  );
};

export default OfferDetailsPage;

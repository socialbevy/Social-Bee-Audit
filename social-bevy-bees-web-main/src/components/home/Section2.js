import React from 'react';
import Image from 'next/image';
import { UserIcon, FireIcon } from '@heroicons/react/24/outline';
import InfoCard from '../cards/InfoCard';
import ubuntu from '@/utils/ubuntu';

const Section2 = () => {
  return (
    <section className="relative w-full py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-extrabold text-gray-900 uppercase ${ubuntu.className}`}>How The Hive Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-white justify-center rounded-lg shadow-md">
            <Image
              src="/images/bee2.png"
              alt="Bevy Bee"
              width={100}
              height={100}
              className="mb-4 md:mb-0 animate-bounce"
            />
            <h3 className={`text-2xl font-bold mb-2 ${ubuntu.className}`}>Let’s Bee..gin!</h3>
          </div>
          <InfoCard
            title="CREATE YOUR ACCOUNT"
            body="Join the hive of excitement in just a few clicks! Provide your basic details, and start enjoying exclusive perks and a vibrant community."
            Icon={UserIcon}
          />
          <InfoCard
            title="BECOME A V.I.BEE"
            body="Upgrade to V.i.Bee for exclusive perks, early access to offers, ad-free browsing, and more."
            Icon={FireIcon}
          />
        </div>
      </div>
    </section>
  );
};

export default Section2;
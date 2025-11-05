'use client'

import React from 'react';
import LandingPage from '@/components/home/LandingPage';
import Marketplace from '@/components/marketplace/Marketplace';
import { useUser } from '@/lib/auth/authConfig';

export default function Home() {
  const { data: user } = useUser();

  if (user) {
    return (
      <Marketplace />
    );
  }

  return (
    <LandingPage />
  );
}

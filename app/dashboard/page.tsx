"use client";
// import JobBoardLanding from '@/app/components/JobBoardLanding';

// export default function Home() {
//   return <JobBoardLanding />;
// }

import React, { useEffect, useState } from "react";

import RecruiterDashboard from "../components/dashboard/RecruiterDashboard";
import UserDashboard from "../components/dashboard/UserDashboard";
import { useGetOffers } from "../hooks/useOffers";
import { useGetUserInfo } from "../hooks/useUserInfo";

import { Offer } from "../types/offer";
import { useGetLocations } from "../hooks/useLocations";
import { Role } from "../types/user";

const Dashboard = () => {
  const [role, setRole] = useState(Role.USER);
  // const [offersData, setOffersData] = useState<Offer[]>([]);
  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    isError: isErrorUserInfo,
    error: errorUserInfo,
  } = useGetUserInfo();

  const {
    data: locations,
    isLoading: isLoadingLocations,
    error: errorLocations,
    isError: isErrorLocations,
  } = useGetLocations();
  const {
    data: offersData,
    isLoading: isLoadingOffers,
    isError: isErrorOffers,
    error: errorOffers,
  } = useGetOffers();

  const offers = offersData ?? [];
  const contractTypes: string[] =
    offers?.length > 0
      ? Array.from(new Set(offers.map((offer: Offer) => offer.contract_type)))
      : [];

  const applicationsNumber: number =
    offers?.reduce(
      (acc: number, offer: Offer) =>
        acc + (offer?.applications ? offer?.applications.length : 0),
      0,
    ) || 0;

  useEffect(() => {
    setRole(userInfo?.role ?? Role.USER);
  }, [userInfo]);

  return (
    <div className="h-full w-full">
      {role === Role.RECRUITER ? (
        <RecruiterDashboard
          offers={offers ?? []}
          contractTypes={contractTypes}
          applicationsNumber={applicationsNumber}
          locations={locations ?? []}
          isLoading={isLoadingLocations ?? isLoadingOffers ?? isLoadingUserInfo}
          isError={isErrorLocations ?? isErrorOffers ?? isErrorUserInfo}
          error={errorLocations ?? errorOffers ?? errorUserInfo}
          userId={userInfo?.id ?? 0}
        />
      ) : (
        <UserDashboard
          offers={offers ?? []}
          contractTypes={contractTypes}
          locations={locations ?? []}
          isLoading={isLoadingLocations ?? isLoadingOffers ?? isLoadingUserInfo}
          isError={isErrorLocations ?? isErrorOffers ?? isErrorUserInfo}
          error={errorLocations ?? errorOffers ?? errorUserInfo}
        />
      )}
    </div>
  );
};

export default Dashboard;

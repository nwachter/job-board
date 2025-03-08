"use client";

import { useEffect, useState } from "react";
import RecruiterDashboard from "../components/dashboard/RecruiterDashboard";
import UserDashboard from "../components/dashboard/UserDashboard";
import { useOffers } from "../hooks/useOffers";
import { useUserInfo } from "../hooks/useUserInfo";

export default function DashboardPage() {
  // Don't set default state here, wait for data
  const [role, setRole] = useState<string | null>(null);
  const {data: userInfo, isLoading: isUserLoading, error: userError} = useUserInfo();
  const {data: offers, isLoading: isOffersLoading, contractTypes, applicationsNumber, error: offersError} = useOffers();

  useEffect(() => {
    if (userInfo) {
      setRole(userInfo.role ?? null);
    }
  }, [userInfo]);

  // Show loading state until all data is ready
  if (isUserLoading || isOffersLoading || !role) {
    return (
      <div className="flex w-full items-center justify-center h-full">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  if (userError || offersError) {
    return (
      <div className="flex w-full items-center justify-center h-full">
        <div className="animate-pulse rounded-full h-5 w-5 border-b-2 bg-red-700"></div>
        <span className="ml-2">Erreur</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {role === "recruiter" ? (
        <RecruiterDashboard 
          offers={offers || []} 
          contractTypes={contractTypes || []} 
          applicationsNumber={applicationsNumber || 0}
        />
      ) : (
        <UserDashboard 
          offers={offers || []} 
          contractTypes={contractTypes || []} 
        />
      )}
    </div>
  );
};
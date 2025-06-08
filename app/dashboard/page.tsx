"use client";

import React, { useEffect, useMemo, useState } from "react";

import RecruiterDashboard from "../components/dashboard/RecruiterDashboard";
import UserDashboard from "../components/dashboard/UserDashboard";
import { useGetOffers } from "../hooks/useOffers";
import { useGetUserInfo } from "../hooks/useUserInfo";

import { Offer } from "../types/offer";
import { useGetLocations } from "../hooks/useLocations";
import { Role } from "../types/user";
import { useGetApplications } from "../hooks/useApplication";
import { Application } from "../types/application";

const Dashboard = () => {
  const [role, setRole] = useState<Role>(Role.USER);
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

  const {
    data: applications,
    isLoading: isLoadingApplications,
    isError: isErrorApplications,
    error: errorApplications,
  } = useGetApplications();

  const filteredApplications = useMemo(() => {
    if (!applications || !Array.isArray(applications) || !userInfo) return [];

    if (userInfo.role === Role.USER) {
      return applications?.filter((application) => {
        return application.user_id === userInfo.id;
      });
    } else if (userInfo.role === Role.RECRUITER) {
      if (!offersData || !Array.isArray(offersData)) return [];

      const recruiterOffersWithApplis =
        offersData?.filter((offer) => {
          return (
            offer.recruiter_id === userInfo.id &&
            offer.applications !== undefined
          );
        }) ?? [];
      console.log("recruiterOffers", recruiterOffersWithApplis);
      const recruiterOffersApplications =
        recruiterOffersWithApplis?.flatMap((offer) => {
          return offer.applications ?? [];
        }) ?? [];
      console.log("recruiterOffersApplications", recruiterOffersApplications);
      const recruiterApplications: Application[] =
        recruiterOffersApplications?.filter((application) => {
          return application !== undefined;
        }) as Application[];
      console.log("recruiterApplications", recruiterApplications);
      return recruiterApplications;
    } else {
      return [];
    }
  }, [applications, userInfo, offersData]);

  const filteredOffers = useMemo(() => {
    if (!offersData || !Array.isArray(offersData) || !userInfo) return [];

    if (userInfo.role === Role.RECRUITER) {
      return offersData?.filter((offer) => {
        return offer.recruiter_id === userInfo.id;
      });
    } else if (userInfo.role === Role.USER) {
      return offersData;
    } else {
      return [];
    }
  }, [offersData, userInfo]);

  const contractTypes: string[] = useMemo(() => {
    if (!offersData || offersData.length === 0) return [];
    return Array.from(
      new Set(
        offersData?.map((offer: Offer) => {
          return offer.contract_type;
        }),
      ),
    );
  }, [offersData]);

  const applicationsNumber: number = useMemo(() => {
    if (!offersData) return 0;
    return offersData.reduce((acc: number, offer: Offer) => {
      return acc + (offer?.applications ? offer.applications.length : 0);
    }, 0);
  }, [offersData]);

  useEffect(() => {
    if (userInfo?.role) {
      setRole(userInfo.role);
    }
  }, [userInfo?.role]);

  if (isLoadingUserInfo) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-purple-500"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  if (isErrorUserInfo) {
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 transition-all dark:bg-gray-800 dark:text-red-400">
        Erreur lors du chargement des informations utilisateur:{" "}
        {errorUserInfo?.message}
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p>Impossible de charger les informations utilisateur</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {role === Role.RECRUITER || role === Role.ADMIN ? (
        <RecruiterDashboard
          offers={filteredOffers}
          applications={filteredApplications}
          contractTypes={contractTypes}
          applicationsNumber={applicationsNumber}
          locations={locations ?? []}
          isLoading={
            isLoadingLocations || isLoadingOffers || isLoadingApplications
          }
          isError={isErrorLocations || isErrorOffers || isErrorApplications}
          error={errorLocations || errorOffers || errorApplications}
          userId={userInfo.id}
        />
      ) : (
        <UserDashboard
          offers={filteredOffers}
          applications={filteredApplications}
          contractTypes={contractTypes}
          locations={locations ?? []}
          isLoading={
            isLoadingLocations || isLoadingOffers || isLoadingApplications
          }
          isError={isErrorLocations || isErrorOffers || isErrorApplications}
          error={errorLocations || errorOffers || errorApplications}
        />
      )}
    </div>
  );
};

export default Dashboard;

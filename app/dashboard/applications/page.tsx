"use client";
import Applications from "@/app/components/dashboard/applications/Applications";
import RecruiterApplications from "@/app/components/dashboard/applications/RecruiterApplications";
import { useGetApplications } from "@/app/hooks/useApplication";
import { useGetOffers, useGetOffersByRecruiterId } from "@/app/hooks/useOffers";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";
import { Role } from "@/app/types/user";
import React, { useEffect, useMemo } from "react";

const ApplicationsPage = () => {
  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    isError: isErrorUserInfo,
    error: errorUserInfo,
  } = useGetUserInfo();
  const {
    data: applications,
    isLoading: isLoadingApplications,
    isError: isErrorApplications,
    error: errorApplications,
  } = useGetApplications();

  const filteredApplications = useMemo(() => {
    if (userInfo?.role === Role.USER) {
      return applications?.filter(
        (application) => application.user_id === userInfo?.id,
      );
    }
    return applications;
  }, [applications]);

  useEffect(() => {
    console.log("dash/applis filteredApplications : ", filteredApplications);
  }, [applications]);

  return (
    <>
      {userInfo?.role && userInfo?.role === Role.USER ? (
        <Applications applications={filteredApplications ?? []} />
      ) : (
        <RecruiterApplications
          recruiterId={userInfo?.id ?? 0}
          applications={filteredApplications ?? []}
        />
      )}
    </>
  );
};

export default ApplicationsPage;

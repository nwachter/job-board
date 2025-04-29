"use client";
import Applications from "@/app/components/dashboard/applications/Applications";
import { useGetApplications } from "@/app/hooks/useApplication";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";
import { Role } from "@/app/types/user";
import React, { useMemo } from "react";

const ApplicationsPage = () => {
  const {
    data: applications,
    isLoading,
    isError,
    error,
  } = useGetApplications();

  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    isError: isErrorUserInfo,
    error: errorUserInfo,
  } = useGetUserInfo();

  const filteredApplications = useMemo(() => {
    if (userInfo?.role === Role.USER) {
      return applications?.filter(
        (application) => application.user_id === userInfo?.id,
      );
    }
    return applications;
  }, [applications]);
  return <Applications applications={filteredApplications ?? []} />;
};

export default ApplicationsPage;

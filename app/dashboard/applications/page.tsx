"use client";
import Applications from '@/app/components/dashboard/applications/Applications'
import { useGetApplications } from '@/app/hooks/useApplication';
import React from 'react'

const ApplicationsPage = () => {
    const {data: applications, isLoading, isError, error} = useGetApplications();

   
  return (
    <Applications applications={applications ?? []}  />
  )
}

export default ApplicationsPage
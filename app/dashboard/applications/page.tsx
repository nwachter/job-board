"use client";
import Applications from '@/app/components/dashboard/applications/Applications'
import { useApplications } from '@/app/hooks/useApplications'
import React from 'react'

const ApplicationsPage = () => {
    const {data: applications} = useApplications();
  return (
    <Applications applications={applications}  />
  )
}

export default ApplicationsPage
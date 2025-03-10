"use client"
import ApplicationDetail from '@/app/components/dashboard/applications/[id]/ApplicationDetail'
import { useGetApplicationById, useGetApplications } from '@/app/hooks/useApplication'
import React, { useEffect } from 'react'

export const ApplicationDetailDashboardPage : React.FC<{params : {
    id: any;
}}> =  ({params}) => {
    const { id } = params;
    const { data: application, isLoading, error } = useGetApplicationById(Number(id));
  
    useEffect(() => {
      console.log("id : ", id, "application: ", application);
    }, [id, application]);
  
    if (isLoading || !application) {
      return <div className='w-full h-full text-electric-purple text-xl p-4'>Chargement...</div>;
    }
//  if(error || application === null) {
//     return <div className='text-red-500 text-xl p-4'>Erreur</div>
//  }
  return (
    <ApplicationDetail application={application}/>
  )
}

export default ApplicationDetailDashboardPage
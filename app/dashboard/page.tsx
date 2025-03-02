
"use client";
// import JobBoardLanding from '@/app/components/JobBoardLanding';

// export default function Home() {
//   return <JobBoardLanding />;
// }

import React, { useEffect, useState } from 'react';

import RecruiterDashboard from '../components/dashboard/RecruiterDashboard';
import UserDashboard from '../components/dashboard/UserDashboard';
import { useOffers } from '../hooks/useOffers';
import { useUserInfo } from '../hooks/useUserInfo';


const Dashboard = () => {
  const [role, setRole] = useState('user');
  // const [offersData, setOffersData] = useState<Offer[]>([]);
  const {data: userInfo} = useUserInfo();

  const {data: offers, contractTypes: contractTypes, applicationsNumber: applicationsNumber} = useOffers();

  useEffect(() => {
    setRole(userInfo?.role ?? 'user');
  }, [userInfo])

  

  return (
    <div className="h-full w-full">
      {
        role === "recruiter" ?
        <RecruiterDashboard offers={offers ?? []} contractTypes={contractTypes} applicationsNumber={applicationsNumber}/>
        : <UserDashboard offers={offers ?? []} contractTypes={contractTypes} />
      }
    </div>
  );
};




export default Dashboard;
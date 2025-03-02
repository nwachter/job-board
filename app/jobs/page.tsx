
"use client";


import React, { useEffect, useState } from 'react';
import { useOffers } from '../hooks/useOffers';
import { useUserInfo } from '../hooks/useUserInfo';
import Jobs from '../components/dashboard/Jobs';



const Dashboard = () => {
  const [role, setRole] = useState('user');
  // const [offersData, setOffersData] = useState<Offer[]>([]);
  // const {data: userInfo} = useUserInfo();

  const {data: offers, contractTypes: contractTypes} = useOffers();

  // useEffect(() => {
  //   setRole(userInfo?.role ?? 'user');
  // }, [userInfo])

  
  return (
    <div className="flex h-full w-full">
      {
        <Jobs offers={offers ?? []} contractTypes={contractTypes} />
      }
    </div>
  );
};




export default Dashboard;
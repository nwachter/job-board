
"use client";
// import JobBoardLanding from '@/app/components/JobBoardLanding';

// export default function Home() {
//   return <JobBoardLanding />;
// }

import React, { useEffect, useState } from 'react';
import { 
  Search, 
  BookmarkPlus,
  Badge
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import JobCard from '../components/general/JobCard';
import RecruiterDashboard from '../components/dashboard/RecruiterDashboard';
import UserDashboard from '../components/dashboard/UserDashboard';
import { useOffers } from '../hooks/useOffers';
import { getUserInfo } from '../hooks/useUserInfo';


const Dashboard = () => {
  const [role, setRole] = useState('user');
  const [offersData, setOffersData] = useState([]);
  const userInfo = getUserInfo();

  const {data: offers} = useOffers();

  useEffect(() => {
    console.log("offers : ", offers, "role : ",  role);
    setRole(userInfo?.role);
  }, [])

  useEffect(() => {
   
  
  }, [offers])
  
  

  return (
    <div className="flex h-full w-full">
      {
        role === "recruiter" ?
        <RecruiterDashboard offers={offers ?? []} />
        : <UserDashboard offers={offers ?? []} />
      }
    </div>
  );
};




export default Dashboard;
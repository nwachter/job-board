
"use client";
// import JobBoardLanding from '@/app/components/JobBoardLanding';

// export default function Home() {
//   return <JobBoardLanding />;
// }

import React, { useState } from 'react';
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


const Dashboard = () => {
  const [role, setRole] = useState('user');

  const {data: offers} = useOffers();

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
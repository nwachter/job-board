
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


const Dashboard = () => {
  const [role, setRole] = useState('user');

  return (
    <div className="flex h-full w-full">
     
      {
        role === "recruiter" ?
        <RecruiterDashboard />
        : <UserDashboard />
      }
    </div>
  );
};




export default Dashboard;
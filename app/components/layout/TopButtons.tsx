"use client";
import { useGetUserInfo } from '@/app/hooks/useUserInfo';
import { logout } from '@/app/services/auth';
import { StopIcon } from '@radix-ui/react-icons';
import { User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'

const TopButtons = () => {
  const page = usePathname().split('/')[1];

  const { data: userInfo } = useGetUserInfo();

  // useEffect(() => {
  //   const fetchAllUserInfo = async () => {
  //     try {
  //       if (!userInfo) {
  //         return null;
  //       }
  //       const userData = await useUserInfo();
  //       setUser(userData);

  //     } catch (error) {
  //       console.error("Erreur lors de la récupération des infos user", error);
  //       return null

  //     }
  //   }

  //   fetchAllUserInfo();

  // }, [userInfo])

  useEffect(() => {
    console.log("userInfo (topbuttons) : ", userInfo);
  
    
  }, [userInfo])
  


  const handleLogout = async () => {
    await logout();
  }

  // const navItems = [
  //   { id: 'jobs', icon: '✳', color: 'bg-indigo-600' },
  //   { id: 'categories', icon: '👤', color: 'bg-red-400' },
  //   { id: 'about', icon: '↓', color: 'bg-green-400' },
  //   { id: 'blog', icon: '📝', color: 'bg-pink-400' }
  // ];

  if (page === "sign") {
    return null;
  }
  return (
    <div className="z-50 p-4 flex items-center justify-end gap-4">
        {/* {userInfo?.avatar ? <Image src={userInfo?.avatar} alt="User avatar" width={24} height={24} className="rounded-full text-gray-600" /> : <User className="w-6 h-6 text-gray-600" />} */}
        <Link href="/profile">{userInfo?.avatar ? <Image src={userInfo?.avatar} width={40} height={40} alt="User avatar" className="rounded-full text-gray-600 w-10 h-10 bg-cover bg-center border-2 shadow-md hover:filter hover:brightness-125 active:filter active:brightness-90 transition-all duration-300 border-[#e2007c]" /> : <User className="w-6 h-6 text-gray-600" />}</Link>
     
      {userInfo !== null && <StopIcon onClick={handleLogout} className=' hover:brightness-125 hover:filter hover:shadow-md transition-all duration-300 w-6 h-6 bg-[#e2007c]' />}
     {!userInfo && <Link href="/sign"><button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">S&apos;inscrire
      </button>
      </Link>}

    </div>
  )
}

export default TopButtons
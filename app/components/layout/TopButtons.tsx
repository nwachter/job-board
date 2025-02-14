"use client";
import { useLogout } from '@/app/hooks/useAuth';
import { getUserInfo, useUserInfo } from '@/app/hooks/useUserInfo';
import { getUserById } from '@/app/services/users';
import { StopIcon } from '@radix-ui/react-icons';
import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const TopButtons = () => {
  const page = usePathname().split('/')[1];
  const [user, setUser] = useState<{id: string, avatar: string, email: string, username: string} | null>(null);

  const { data: userInfo } = useUserInfo();

  useEffect(() => {
    const fetchAllUserInfo = async () => {
      try {
        if (!userInfo) {
          return null;
        }
        const userData = await getUserById(userInfo?.id);
        setUser(userData);

      } catch (error) {
        console.error("Erreur lors de la récupération des infos user", error);
        return null

      }
    }

  }, [userInfo])


  const handleLogout = async () => {
    await useLogout();
  }


  const navItems = [
    { id: 'jobs', icon: '✳', color: 'bg-indigo-600' },
    { id: 'categories', icon: '👤', color: 'bg-red-400' },
    { id: 'about', icon: '↓', color: 'bg-green-400' },
    { id: 'blog', icon: '📝', color: 'bg-pink-400' }
  ];
  if (page === "sign") {
    return null;
  }
  return (
    <div className="absolute z-50 top-0 right-0 p-4 flex items-center space-x-4">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
        {user?.avatar ? <img src={user?.avatar} alt="User avatar" className="w-6 h-6 rounded-full text-gray-600" /> : <User className="w-6 h-6 text-gray-600" />}
      </div>
      {user !== null && <StopIcon className=' hover:brightness-90 hover:filter hover:shadow-md w-6 h-6 bg-[#e2007c]' />}
      <Link href="/sign"><button className="bg-indigo-600 text-white px-6 py-2 rounded-lg"> S'inscrire
      </button>
      </Link>

    </div>
  )
}

export default TopButtons
"use client";
import React from 'react'
import Profile from '../components/profile/Profile'
import { useGetUserInfo } from '@/app/hooks/useUserInfo';

const ProfilePage = () => {
    const {data: userInfo, isLoading: isLoading, error: error} = useGetUserInfo();
    if (error) return <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-all">{error.message}</div>;
    if (isLoading) return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
        <span className="ml-2">Chargement du dashboard utilisateur...</span>
      </div>
    );
  return (
    <Profile user={userInfo ?? null} />
  )
}

export default ProfilePage
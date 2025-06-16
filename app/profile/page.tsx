"use client";
import React from "react";
import Profile from "../components/profile/Profile";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";

const ProfilePage = () => {
  const {
    data: userInfo,
    isLoading: isLoading,
    error: error,
  } = useGetUserInfo();

  if (error)
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 transition-all dark:bg-gray-800 dark:text-red-400">
        {error.message}
      </div>
    );
  if (isLoading || !userInfo)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-purple-500"></div>
        <span className="ml-2">Chargement du dashboard utilisateur...</span>
      </div>
    );
  if (!userInfo)
    <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 transition-all dark:bg-gray-800 dark:text-red-400">
      Erreur lors de la récupération des informations utilisateur
    </div>;
  return <Profile user={userInfo ?? null} />;
};

export default ProfilePage;

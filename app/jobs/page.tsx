"use client";

import React, { useEffect, useState } from "react";
import { useGetOffers } from "../hooks/useOffers";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";
import Jobs from "../components/dashboard/Jobs";
import { Offer } from "../types/offer";

const Dashboard = () => {
  const [role, setRole] = useState("user");
  // const [offersData, setOffersData] = useState<Offer[]>([]);
  // const {data: userInfo} = useUserInfo();

  const { data: offers } = useGetOffers();

  // useEffect(() => {
  //   setRole(userInfo?.role ?? 'user');
  // }, [userInfo])

  const contractTypes: string[] =
    offers && offers?.length > 0
      ? Array.from(new Set(offers.map((offer: Offer) => offer.contract_type)))
      : [];

  const applicationsNumber: number =
    offers?.reduce(
      (acc: number, offer: Offer) =>
        acc + (offer?.applications ? offer?.applications.length : 0),
      0
    ) || 0;

  return (
    <div className="flex h-full w-full">
      {<Jobs offers={offers ?? []} contractTypes={contractTypes} />}
    </div>
  );
};

export default Dashboard;

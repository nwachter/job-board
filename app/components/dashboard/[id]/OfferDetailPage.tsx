"use client"
import OfferDetail from '@/app/components/dashboard/[id]/OfferDetail'
import { useOffer } from '@/app/hooks/useOffer'
import React, { useEffect, useState } from 'react'
import NewApplication from './NewApplication'

const OfferDetailDashboardPage : React.FC<{params : {
    id: string;
}}> =  ({params}) => {
    const { id } = params;
    const { data: offer, isLoading, error } = useOffer(Number(id));
    const [isApplicationOpen, setIsApplicationOpen] = useState<boolean>(false);

    useEffect(() => {
      console.log("id : ", id, "offer: ", offer);
    }, [id, offer]);
  
    if (isLoading || !offer) {
      return <div className='w-full h-full text-electric-purple flex justify-center items-center text-xl p-4'>Chargement...</div>;
    }
 if(error || offer === null) {
    return <div className='text-red-500 flex justify-center items-center text-xl p-4'>Erreur</div>
 }
  return (
    <div className='flex flex-col gap-6 items-center justify-center'>   
    <OfferDetail offer={offer} setIsApplicationOpen={setIsApplicationOpen}/>
    {  isApplicationOpen && offer?.id && <NewApplication offer_id={offer?.id} />}
    </div>


  )
}

export default OfferDetailDashboardPage
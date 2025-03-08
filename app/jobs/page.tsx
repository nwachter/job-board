
"use client";


import { useOffers } from '../hooks/useOffers';
import Jobs from '../components/dashboard/Jobs';

const JobsPage = () => {

  const {data: offers, contractTypes: contractTypes} = useOffers();
  
  return (
    <div className="flex h-full w-full">
      {
        <Jobs offers={offers ?? []} contractTypes={contractTypes} />
      }
    </div>
  );
};




export default JobsPage;
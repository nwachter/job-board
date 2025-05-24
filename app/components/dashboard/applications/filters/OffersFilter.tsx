import { FilterBase } from "@/app/components/general/modals/FilterBase";
import { Offer } from "@/app/types/offer";
import { Briefcase, ChevronDown } from "lucide-react";
import React from "react";
type OffersFilterProps = {
  offersList: Offer[];
  offerFilter: number | "ALL";
  setOfferFilter: React.Dispatch<React.SetStateAction<number | "ALL">>;
  setIsOpenOffersFilter: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenOffersFilter: boolean;
};
const OffersFilter: React.FC<OffersFilterProps> = ({
  offersList,
  offerFilter,
  setOfferFilter,
  setIsOpenOffersFilter,
  isOpenOffersFilter,
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpenOffersFilter(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
      >
        <Briefcase size={16} className="text-gray-500" />
        Offre
        <ChevronDown size={16} className="text-gray-500" />
      </button>
      <FilterBase
        isOpen={isOpenOffersFilter}
        onClose={() => setIsOpenOffersFilter(false)}
      >
        <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            onClick={() => setOfferFilter("ALL")}
            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${offerFilter === "ALL" ? "bg-purple-50 text-electric-purple" : ""}`}
          >
            Toutes les offres
          </button>
          {offersList.map((offer: Offer) => (
            <button
              key={offer.id}
              onClick={() => setOfferFilter(offer.id)}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${offerFilter === offer.id ? "bg-purple-50 text-electric-purple" : ""}`}
            >
              {offer.title}
            </button>
          ))}
        </div>
      </FilterBase>
    </div>
  );
};

export default OffersFilter;

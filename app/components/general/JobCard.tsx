import { Offer } from "@/app/types/offer";
import {
  BookmarkPlus,
  // Badge
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import React from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const JobCard: React.FC<{ offer: Offer; router?: AppRouterInstance; onDelete?: (id: number) => void }> = ({
  offer,
  router,
  onDelete,
}) => {
  return (
    <div className="old:shadow-eggplant/15 rounded-2xl border border-electric-purple/20 bg-white/90 p-6 shadow-lg shadow-electric-purple/5 backdrop-blur-sm transition-all hover:scale-[102%] hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-1 font-merriweather-sans text-lg font-semibold">{offer.title}</h3>
          <p className="font-dm-sans text-sm text-gray-600">{offer.company_name}</p>
        </div>
        {/* <button className="text-purple-600 hover:text-purple-700">
          <BookmarkPlus size={20} />
        </button> */}

        {onDelete && (
          <button
            onClick={() => onDelete(offer?.id)}
            className="flex w-fit  items-center justify-center  transition-all px-2 py-2 text-left text-red-600 hover:bg-slate-100 rounded-full"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-4 space-y-3 font-dm-sans">
        <div className="flex gap-2">
          {/* <Badge className="border-[1px] border-electric-purple/30  transition-all  bg-electric-purple/10 text-purple-600 hover:bg-electric-purple/30 rounded-3xl">
                {offer.contract_type}
              </Badge> */}
          <Badge className="rounded-3xl border-[1px] border-mint/30 bg-mint/10 text-mint transition-all hover:bg-mint/30">
            {offer.contract_type}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{offer.salary}€ par an</p>
      </div>

      <div className="flex items-center justify-between border-t pt-4 font-dm-sans">
        {offer.applications && (
          <span className="text-sm text-gray-500">{offer?.applications?.length} candidatures</span>
        )}
        {router && (
          <button
            onClick={() => router.push(`/dashboard/${offer?.id}`)}
            className="rounded-lg px-4 py-2 font-dm-sans text-purple-600 transition-colors hover:bg-purple-50"
          >
            Voir plus
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;

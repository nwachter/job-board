import { Offer } from '@/app/types/offer'
import { BookmarkPlus, 
  // Badge 
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"

import React from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const JobCard : React.FC<{offer: Offer, router?: AppRouterInstance}> = ({offer, router}) => {

  return (
   
        <div className="bg-white hover:scale-[102%] rounded-xl p-6 shadow-eggplant/15 shadow-md hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold font-merriweather-sans text-lg mb-1">{offer.title}</h3>
              <p className="text-gray-600  font-dm-sans text-sm">{offer.company_name}</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700">
              <BookmarkPlus size={20} /> 
            </button>
          </div>
          
          <div className="space-y-3 font-dm-sans mb-4">
            <div className="flex gap-2">
              {/* <Badge className="border-[1px] border-electric-purple/30  transition-all  bg-electric-purple/10 text-purple-600 hover:bg-electric-purple/30 rounded-3xl">
                {offer.contract_type}
              </Badge> */}
              <Badge className="border-[1px] transition-all  border-mint/30 bg-mint/10 text-mint hover:bg-mint/30 transition-all rounded-3xl">
              {offer.contract_type}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm">
              {offer.salary}€ par an
            </p>
          </div>
      
          <div className="flex font-dm-sans justify-between items-center pt-4 border-t">
            {offer.applications && <span className="text-sm text-gray-500">
              {offer?.applications?.length} candidatures
            </span>}
           {router &&  <button onClick={() => (router.push(`/dashboard/${offer?.id}`))} className="text-purple-600 hover:bg-purple-50 font-dm-sans px-4 py-2 rounded-lg transition-colors">
              Voir plus
            </button>}
          </div>
        </div>
 
  )
}

export default JobCard
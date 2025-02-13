import { Application } from '@/app/types/application'
import { Offer } from '@/app/types/offer'
import { BookmarkPlus, Badge } from 'lucide-react'
import React from 'react'

const JobCard : React.FC<{offer: Offer}> = ({offer}) => {

  return (
   
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">{offer.title}</h3>
              <p className="text-gray-600 text-sm">{offer.company_name}</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700">
              <BookmarkPlus size={20} />
            </button>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex gap-2">
              <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-200">
                CDI
              </Badge>
              <Badge className="bg-green-100 text-green-600 hover:bg-green-200">
                Remote
              </Badge>
            </div>
            <p className="text-gray-600 text-sm">
              {offer.salary}€ par an
            </p>
          </div>
      
          <div className="flex justify-between items-center pt-4 border-t">
            {offer.applications && <span className="text-sm text-gray-500">
              {offer?.applications?.length} candidatures
            </span>}
            <button className="text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors">
              Voir plus
            </button>
          </div>
        </div>
 
  )
}

export default JobCard
import { Application } from '@/app/types/application'
import { BookmarkPlus, 
  // Badge 
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"


import React from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const ApplicationCard : React.FC<{application: Application, router?: AppRouterInstance}> = ({application, router}) => {

  return (
   
        <div className="bg-white hover:scale-[102%] rounded-xl p-6 shadow-eggplant/15 shadow-md hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold font-merriweather-sans text-lg mb-1">{application.firstname} {application.lastname}</h3>
              <p className="text-gray-600  font-dm-sans text-sm">{application?.offer?.title}</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700">
              <BookmarkPlus size={20} /> 
            </button>
          </div>
          
          <div className="space-y-3 font-dm-sans mb-4">
            <div className="flex gap-2">
              {/* <Badge className="border-[1px] border-electric-purple/30  transition-all  bg-electric-purple/10 text-purple-600 hover:bg-electric-purple/30 rounded-3xl">
                {application.contract_type}
              </Badge> */}
              { <Badge className="border-[1px] transition-all  border-mint/30 bg-mint/10 text-mint hover:bg-mint/30 transition-all rounded-3xl">
              {application.offer?.contract_type}
              </Badge>}
            </div>
            <p className="text-gray-600 text-sm">
              {application?.offer?.salary}€ par an
            </p>
          </div>
      
          <div className="flex justify-between font-dm-sans  items-center pt-4 border-t">
            {<span className="text-sm text-gray-500">
              {application?.content}
            </span>}
            <a href={application?.cv} className='text-chocolate-cosmos italic opacity-80 font-roboto underline hover:opacity-100 hover:filter hover:brightness-110 active:filter active:brightness-90 transition-all underline-offset-0'>CV</a>
           {router &&  <button onClick={() => (router.push(`/dashboard/application/${application?.id}`))} className="text-purple-600 hover:bg-purple-50 font-dm-sans px-4 py-2 rounded-lg transition-colors">
              Voir plus
            </button>}
          </div>
        </div>
 
  )
}

export default ApplicationCard
"use client";
import Form from '@/app/components/general/Form';
import { useGetUserInfo } from '@/app/hooks/useUserInfo';
import { createOffer } from '@/app/services/offers';
import { createLocation } from '@/app/services/locations';
import React, { useEffect, useState } from 'react';
import { Currency, FileText, MapPin, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// export type OfferFormInputs = {
//     title: string;
//     description: string;
//     company_name: string;
//     location_id: string;
//     salary: number;
//     ²contract_type: string;
//     city: string;
//     country: string;
//   };

  export type FormInputs = {
    [key: string]: string | number | FileList;
  }
const NewJobPage = () => {
  const [inputs, setInputs] = useState<FormInputs>({
    title: "",
    description: "",
    company_name: "",
    location_id: "",
    salary: 0,
    contract_type: "",
    city: "",
    country: ""
  });

  const { data: userInfo } = useGetUserInfo();
  const recruiterId = userInfo?.id ?? "";
  // const router = useRouter();

  useEffect(() => {
    console.log("Inputs : ", inputs);
  }, [inputs])

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, company_name, city, country, salary, contract_type } = inputs;

    try {
      const locationData = { city : String(city), country: String(country) };
      const {data: createdLocation} = await createLocation(locationData);
   // Vérifiez que createdLocation contient bien l'ID
   if (!createdLocation || !createdLocation.id) {
    throw new Error("Failed to create location or location ID is missing");
  }

  const locationId = createdLocation.id;
  console.log("Created location ID:", locationId);

      console.log("Created id location:", locationId);

      if (locationId) {
        const offerData = {
          title: String(title),
          description: String(title),
          company_name: String(company_name),
          location_id: Number(locationId),
          salary : Number(salary),
          contract_type: String(contract_type),
          recruiter_id: Number(recruiterId)
        };
        const offer = await createOffer(offerData);

        if (offer) {
          console.log("Created offer:", offer);
          alert("Offre créee avec succès!")
          // router.push("/dashboard");
        }

        setTimeout(() => {
         router.push('/dashboard')
          
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Server error, please try again later.");
    }
  };
  return (
    <div className='h-full w-full'>
            <Form 
                title={'Créer une offre d\'emploi'} 
                description={'Remplissez les champs suivants pour créer une offre d\'emploi'} 
                fields={[
                    { name: 'title', type: 'text', placeholder: 'Titre de l\'offre', icon: <Building2 />, value: String(inputs.title) },
                    { name: 'description', type: 'text', placeholder: 'Description de l\'offre', icon: <FileText />, value: String(inputs.description) },
                    { name: 'company_name', type: 'text', placeholder: 'Nom de l\'entreprise', icon: <Building2 size={20} />, value: String(inputs.company_name) },
                    { name: 'city', type: 'text', placeholder: 'Ville', icon: <MapPin size={20} />, value: String(inputs.city) },
                    { name: 'country', type: 'text', placeholder: 'Pays', icon: <MapPin size={20} />, value: String(inputs.country) },
                    { name: 'salary', type: 'number', placeholder: 'Salaire', icon: <Currency size={20} />, value: inputs.salary.toString() },
                    { name: 'contract_type', type: 'text', placeholder: 'Type de contrat', icon: <FileText size={20} />, value: String(inputs.contract_type) }
                  ]}
                handleSubmit={handleSubmit}
                setInputs={setInputs}
            />
    </div>
  )
}

export default NewJobPage;
"use client";
import Form from '@/app/components/general/Form';
import { useGetUserInfo } from '@/app/hooks/useUserInfo';
import { createApplication } from '@/app/services/applications';
import { createLocation } from '@/app/services/locations';
import React, { useEffect, useState } from 'react';
import { Currency, FileText, MapPin, Building2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormInputs } from '@/app/jobs/new/page';
import { uploadPdfFile } from '@/app/services/upload';

// export type FormInputs = {
//     firstname: string;
//     lastname: string;
//     email: string;
//     content: string;
//     cv: string;
//   };

type NewApplicationProps = {
  offer_id: number
}
const NewApplication: React.FC<NewApplicationProps> = ({ offer_id }) => {
  const [inputs, setInputs] = useState<FormInputs>({
    firstname: "",
    lastname: "",
    email: "",
    content: "",
    cv: null as unknown as FileList
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
    const { firstname, lastname, email, content, cv } = inputs;

    try {

      const userId = userInfo?.id;

      if (userId) {
        const fileLink = await uploadPdfFile(cv as FileList)
       console.log("Uploaded file :", fileLink)
        if (fileLink) {
          const applicationData = {
            firstname: String(firstname),
            lastname: String(lastname),
            content: String(content),
            email: String(email),
            user_id: Number(userId),
            offer_id: Number(offer_id),
            cv: String(fileLink),

          };
          const application = await createApplication(applicationData);

          if (application) {
            console.log("Candidature créee:", application);
            alert("Candidature créee avec succès!")
            // router.push("/dashboard");
          }
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
        title={'Candidater à l\'offre'}
        description={'Remplissez les champs suivants pour candidater'}
        fields={[
          { name: 'firstname', type: 'text', placeholder: 'Prénom', icon: <User />, value: String(inputs.firstname) },
          { name: 'lastname', type: 'text', placeholder: 'Nom', icon: <MapPin size={20} />, value: String(inputs.lastname) },
          { name: 'content', type: 'text', placeholder: 'Contenu de la candidature', icon: <FileText />, value: String(inputs.content) },
          { name: 'email', type: 'text', placeholder: 'Email', icon: <MapPin size={20} />, value: String(inputs.email) },
          { name: 'cv', type: 'file', placeholder: 'Lien du CV', icon: <FileText size={20} />, value: inputs.cv as FileList }
        ]}
        handleSubmit={handleSubmit}
        setInputs={setInputs}
      />
    </div>
  )
}

export default NewApplication;
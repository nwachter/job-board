"use client";
import Form from '@/app/components/general/Form'
import { getUserInfo } from '@/app/hooks/useUserInfo';
import { createOffer } from '@/app/services/offers';
import { Offer } from '@/app/types/offer';
import React, { useState } from 'react'
import { Currency, FileText, MapPin, Building2 } from 'lucide-react';
const NewJobPage = () => {
     const [inputs, setInputs] = useState<Omit<Offer, "id" | "recruiter_id">>({
        title: "",
        description: "",
        company_name: "",
        location_id: "",
        salary: 0,
        contract_type: ""
        });

        const recruiterId = getUserInfo()?.id ?? null;
        /*
        model Offer {
  id            Int      @id @default(autoincrement())
  title         String
  description   String
  company_name  String
  salary        Int
  location      Location? @relation(fields: [location_id], references: [id])
  location_id   Int?
  contract_type String?
  recruiter         User     @relation("RecruiterOffers", fields: [recruiter_id], references: [id])
  recruiter_id      Int

  applications  Application[]
}
        */

//handleChange to get the selected Location

    const validateInput = (value: string, min: number, max: number, regex: RegExp, name: string) => {
        const translatedName = name === "password" || name === "password_confirmation" ? "mot de passe" : name;
        if ((inputs.location_id !== "")) {
            return "Les mots de passe ne correspondent pas";
        }
        if (value.length < min) {
            return `Le ${translatedName} doit contenir au moins ${min} caractères`;
        }
        if (value.length > max) {
            return `Le ${translatedName} doit contenir au plus ${max} caractères`;
        }
        if (!regex.test(value)) {
            return name === "password"
                ? `Le ${translatedName} doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre`
                : `Le ${translatedName} ne doit pas contenir de caractères spéciaux`;
        }

        return "";
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string, min: number, max: number, regex: RegExp) => {
        const value = event.target.value;
        const error = validateInput(value, min, max, regex, fieldName);
        setInputs((prevInputs) => ({ ...prevInputs, [fieldName]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let alertType;
        //first post the location
        //then post the offer
        const { title, description, company_name, location_id, salary, contract_type } = inputs;   
        try {
            const data = await createOffer({ title, description, company_name, location_id, salary, contract_type, recruiter_id: recruiterId });

            if (data && data.token) {
                localStorage.setItem("isConnected", "true");
                const userInfo = {
                    id: data?.user?.id,
                    role: data?.user?.role,
                    username: data?.user?.username,
                    email: data?.user?.email,        
                }
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                // localStorage.setItem("token", data?.token); //Mtn dans le cookie et passé avec credentials
                console.log("Successful connexion. Adding data to LS")
            }

            // alertType = data?.user ? "success" : "danger"; //testerror a modif
            // setAlert({
            //     type: alertType,
            //     message: alertData[alertType].message,
            // });


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
                    { name: 'title', type: 'text', placeholder: 'Titre de l\'offre', icon: <Building2 />, value: inputs.title},
                    { name: 'description', type: 'text', placeholder: 'Description de l\'offre', icon: <FileText />, value: inputs.description},
                    { name: 'company_name', type: 'text', placeholder: 'Nom de l\'entreprise', icon: <Building2 size={20} />, value: inputs.company_name},
                    { name: 'location_id', type: 'text', placeholder: 'Localisation', icon: <MapPin size={20} />, value: inputs.location_id ?? ''},
                    { name: 'salary', type: 'number', placeholder: 'Salaire', icon: <Currency size={20} />, value: inputs.salary.toString()},
                    { name: 'contract_type', type: 'text', placeholder: 'Type de contrat', icon: <FileText size={20} />, value: inputs.contract_type}
                ]} 
                handleSubmit={handleSubmit} setInputs={setInputs}
            />
    </div>
  )
}

export default NewJobPage;
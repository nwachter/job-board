import { FormInputs } from '@/app/jobs/new/page';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {  ArrowRight } from 'lucide-react';
import React from 'react'

type FormFieldProps = {
    icon: React.ReactNode;
    error?: string;
    setInputs: React.Dispatch<React.SetStateAction<FormInputs>>
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormField: React.FC<FormFieldProps> = ({ icon, error, setInputs, ...props }) => (
    <div className="flex flex-col">
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
            </div>
            <input
                {...props}
                onChange={e => setInputs(prev => ({...prev, [e.target.name]: e.target.files ? e.target.files : e.target.value}))}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

type Fields = { name: string, type: string, placeholder: string, icon: React.ReactNode, value: string | FileList }[];
type FormProps = {
    title: string;
    description: string;
    fields: Fields;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    setInputs: React.Dispatch<React.SetStateAction<FormInputs>>;
};

export const Form : React.FC<FormProps> = ({title, description, fields, handleSubmit, setInputs}) => {

  return (
    <div className="w-full font-dm-sans flex-1 h-full rounded-ss-3xl flex items-center justify-center">
    <Card className="w-full mx-auto my-auto max-w-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
            <h1 className="text-2xl font-merriweather-sans font-bold mb-2">
                {title}
            </h1>
            <p className="text-gray-600 font-dm-sans">
                {description}
            </p>
            {/* {alert.type && alertData[alert.type] && (
                <div className={alertData[alert.type].css} role="alert">
                    <span className="font-semibold">
                        {alertData[alert.type].name}
                    </span>{" "}
                    {alert.message}
                </div>
            )} */}
        </CardHeader>
        <CardContent className="pt-6">
            <form onSubmit={handleSubmit} method="POST" className="space-y-4">
               
                {fields.map(( {name, type, icon, placeholder}, i) => (
                    <FormField
                    key={`field-${i}`}
                    icon={icon}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    setInputs={setInputs}
                />
                ))}
     
                <button className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <span>Envoyer</span>
                    <ArrowRight size={20} className="ml-2" />
                </button>
                {/* <div className="text-center mt-6">
                    <p className="text-gray-600">
             
                        {' '}
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                            {isSignUp ? 'Se connecter' : "S'inscrire"}
                        </button>
                    </p>
                </div> */}
            </form>
        </CardContent>
    </Card>
</div>
  )
}

export default Form
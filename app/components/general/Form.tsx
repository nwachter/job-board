import { FormInputs } from "@/app/jobs/new/page";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import React from "react";

type FormFieldProps = {
  icon: React.ReactNode;
  error?: string;
  setInputs: React.Dispatch<React.SetStateAction<FormInputs>>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormField: React.FC<FormFieldProps> = ({
  icon,
  error,
  setInputs,
  ...props
}) => (
  <div className="flex flex-col">
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        {...props}
        onChange={(e) =>
          setInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.files ? e.target.files : e.target.value,
          }))
        }
        className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

type Fields = {
  name: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string | FileList;
}[];
type FormProps = {
  title: string;
  description: string;
  fields: Fields;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setInputs: React.Dispatch<React.SetStateAction<FormInputs>>;
};

export const Form: React.FC<FormProps> = ({
  title,
  description,
  fields,
  handleSubmit,
  setInputs,
}) => {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center rounded-ss-3xl font-dm-sans">
      <Card className="mx-auto my-auto w-full max-w-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2 text-center">
          <h1 className="mb-2 font-merriweather-sans text-2xl font-bold">
            {title}
          </h1>
          <p className="font-dm-sans text-gray-600">{description}</p>
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
            {fields.map(({ name, type, icon, placeholder }, i) => (
              <FormField
                key={`field-${i}`}
                icon={icon}
                type={type}
                name={name}
                placeholder={placeholder}
                setInputs={setInputs}
              />
            ))}

            <button className="flex w-full items-center justify-center rounded-lg bg-purple-600 py-2.5 text-white transition-colors hover:bg-purple-700">
              <span>Envoyer</span>
              <ArrowRight size={20} className="ml-2" />
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form;

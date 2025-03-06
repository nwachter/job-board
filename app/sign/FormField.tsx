type FormFieldProps = {
    icon: React.ReactNode;
    error?: string;
    setInputs: 
     React.Dispatch<React.SetStateAction<{
        email: string,
        password: string,
        password_confirmation: string,
        username: string
    }>>
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormField: React.FC<FormFieldProps> = ({ icon, error, setInputs, ...props }) => (
    <div className="flex flex-col">
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
            </div>
            <input
                {...props}
                onChange={e => setInputs((prev: any) => ({...prev, [e.target.name]: e.target.value}))}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);


export default FormField;
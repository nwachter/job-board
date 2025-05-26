type FormFieldProps = {
  icon: React.ReactNode;
  error?: string;
  setInputs: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      password_confirmation: string;
      username: string;
    }>
  >;
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
          setInputs(
            (prev: {
              email: string;
              password: string;
              password_confirmation: string;
              username: string;
            }) => ({ ...prev, [e.target.name]: e.target.value }),
          )
        }
        className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default FormField;

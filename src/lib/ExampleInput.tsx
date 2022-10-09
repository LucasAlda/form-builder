import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

export function FieldError({ name }: { name?: string }) {
  const {
    formState: { errors },
  } = useFormContext();

  if (!name) return null;

  const error = errors[name];

  if (!error) return null;

  return <span className="text-sm text-red-500">{error.message?.toString()}</span>;
}

interface InputProps {
  type: string;
  label: string;
  name: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, type = "text", ...props },
  ref
) {
  return (
    <div className="mb-4 w-72">
      <label>{label}</label>
      <input
        className="block w-full rounded-md border border-gray-300 py-1 px-2 shadow-sm"
        type={type}
        ref={ref}
        {...props}
      />
      <FieldError name={props.name} />
    </div>
  );
});

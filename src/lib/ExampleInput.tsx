import { memo, useState } from "react";
import { useFormContext } from "react-hook-form";

export interface InputProps {
  label: string;
  name: string;
}

export const TextInput = memo(function TextInput({ label, name }: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="mb-4 w-72">
      <label>{label}</label>
      <input
        className="block w-full rounded-md border border-gray-300 py-1 px-2 shadow-sm"
        type="text"
        {...register(name)}
      />
      {error ? <span className="text-sm text-red-500">{error.message?.toString()}</span> : null}
    </div>
  );
});

export const NumberInput = memo(function NumberInput({ label, name }: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="mb-4 w-72">
      <label>{label}</label>
      <input
        className="block w-full rounded-md border border-gray-300 py-1 px-2 shadow-sm"
        type="number"
        step="0.01"
        {...register(name)}
      />
      {error ? <span className="text-sm text-red-500">{error.message?.toString()}</span> : null}
    </div>
  );
});

export const Textarea = memo(function Textarea({ label, name }: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="mb-4 w-72">
      <label>{label}</label>
      <textarea
        className="block w-full rounded-md border border-gray-300 py-1 px-2 shadow-sm"
        {...register(name)}
      />
      {error ? <span className="text-sm text-red-500">{error.message?.toString()}</span> : null}
    </div>
  );
});

export const PasswordInput = memo(function PasswordInput({ label, name }: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4 w-72">
      <label>{label}</label>
      <div className="relative">
        <input
          className="block w-full rounded-md border border-gray-300 py-1 px-2 shadow-sm"
          type={show ? "text" : "password"}
          {...register(name)}
        />
        <button className="absolute right-2 top-2 text-sm" onClick={() => setShow((prev) => !prev)}>
          Ver
        </button>
      </div>
      {error ? <span className="text-sm text-red-500">{error.message?.toString()}</span> : null}
    </div>
  );
});

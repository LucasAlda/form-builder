import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FieldSchema = {
  component?: "text" | "textarea" | "email" | "number" | "password";
  label?: string;
  validator?: z.ZodType;
  initialValue?: string | number | Date | boolean | null;
};

type CustomFieldSchema = {
  component: "custom";
  label?: string;
  validator?: z.ZodType;
  initialValue?: string | number | Date | boolean | null;
  render: (props: { register: string; errors: string }) => JSX.Element;
};

export type FormSchema = {
  [key: string]: FieldSchema | CustomFieldSchema;
};

export type FormData<TSchema> = {
  [B in keyof TSchema]: TSchema[B] extends FormSchema[string]
    ? TSchema[B]["validator"] extends z.ZodType
      ? z.infer<TSchema[B]["validator"]>
      : string | undefined
    : string | undefined;
};

const generateZodSchema = (form: FormSchema) => {
  const schemaObject: { [key: string]: z.ZodType } = {};
  Object.entries(form).forEach(([name, field]) => {
    schemaObject[name] = field.validator ?? z.string().optional();
  });

  return z.object(schemaObject);
};

const generateInitialValues = (form: FormSchema) => {
  const initialValues: { [key: string]: FieldSchema["initialValue"] } = {};
  Object.entries(form).forEach(([name, field]) => {
    if (typeof field === "string") {
      initialValues[name] = null;
    } else {
      initialValues[name] = field.initialValue ?? null;
    }
  });

  return initialValues;
};

export const useAutoForm = <T extends FormSchema>(
  formSchema: T,
  { onSubmit }: { onSubmit: (data: FormData<T>) => Promise<unknown> }
) => {
  const schema = generateZodSchema(formSchema);
  const initialValues = generateInitialValues(formSchema);

  const form = useForm({ resolver: zodResolver(schema), defaultValues: initialValues });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const items = { form, onSubmit: form.handleSubmit(onSubmit), formSchema };
  return { ...items, controller: items };
};

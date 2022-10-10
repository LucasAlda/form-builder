import { zodResolver } from "@hookform/resolvers/zod";
import { NamedExoticComponent } from "react";
import { DeepPartial, useForm } from "react-hook-form";
import { z } from "zod";
import { InputProps } from "./ExampleInput";

type FieldSchema = {
  component?: NamedExoticComponent<InputProps> | ((props: InputProps) => JSX.Element);
  label?: string;
  validator?: z.ZodType;
  initialValue?: string | number | Date | boolean | null;
};

export type FormSchema = {
  [key: string]: FieldSchema;
};

export type FormData<TSchema> = {
  [B in keyof TSchema]: TSchema[B] extends FormSchema[string]
    ? TSchema[B]["validator"] extends z.ZodType
      ? z.infer<TSchema[B]["validator"]>
      : string | undefined
    : string | undefined;
};

// export type InitialValues<TSchema> = {
//   [B in keyof TSchema]?: FieldSchema["initialValue"];
// };
export type InitialValues<TSchema> = { [K in keyof FormData<TSchema>]?: FormData<TSchema>[K] };

const generateZodSchema = (form: FormSchema) => {
  const schemaObject: { [key: string]: z.ZodType } = {};
  Object.entries(form).forEach(([name, field]) => {
    schemaObject[name] = field.validator ?? z.string().optional();
  });

  return z.object(schemaObject);
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const generateInitialValues = <TSchema extends FormSchema>(
  form: TSchema,
  initialValues?: InitialValues<TSchema>
) => {
  if (!initialValues) initialValues = {};
  const init = initialValues ?? {};

  (Object.entries(form) as Entries<typeof form>).forEach(([name, field]) => {
    if (!init[name]) init[name] = (field.initialValue as InitialValues<TSchema>[typeof name]) ?? undefined;
  });

  return init;
};

export const useAutoForm = <T extends FormSchema>(
  formSchema: T,
  {
    onSubmit,
    initialValues,
  }: {
    onSubmit: (data: FormData<T>) => Promise<unknown>;
    initialValues?: InitialValues<T>;
  }
) => {
  const schema = generateZodSchema(formSchema);
  const generatedInitialValues = generateInitialValues(formSchema, initialValues);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: generatedInitialValues as DeepPartial<typeof schema>,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const items = { form, onSubmit: form.handleSubmit(onSubmit), formSchema };
  return { ...items, controller: items };
};
